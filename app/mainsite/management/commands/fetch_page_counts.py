"""
Fills in Book.page_count from, in priority order:

  1. mainsite/data/book_page_counts.json - counts looked up by hand (web
     search of retailer/publisher listings) for books the APIs below don't
     have, keyed by exact book title
  2. Open Library's Books API by ISBN (no key needed, batched 50 per request)
  3. Google Books by ISBN (only if GOOGLE_BOOKS_API_KEY is set in the
     environment - the keyless quota is shared and almost always exhausted)

Then, for books still missing a count, copies it from a variant-cover
sibling of the same edition ("... Omnibus Vol. 1 Dm Kirby Cvr" and
"... Omnibus Vol. 1 Ross Cvr" have the same contents, just different
covers/ISBNs).

By default only books with no count (or an obviously bogus one, < 40) are
updated; --overwrite replaces existing counts with looked-up ones too.

Usage:
    python manage.py fetch_page_counts --dry-run
    python manage.py fetch_page_counts
    python manage.py fetch_page_counts --curated-only   # no network calls
    GOOGLE_BOOKS_API_KEY=... python manage.py fetch_page_counts
"""
import json
import os
import re
import time
from collections import defaultdict
from pathlib import Path

import requests
from django.core.management.base import BaseCommand

from mainsite.models import Book

USER_AGENT = "OmniTrackers/1.0 (page-count lookup)"
OPEN_LIBRARY_URL = "https://openlibrary.org/api/books"
GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/volumes"
OPEN_LIBRARY_BATCH = 50
CURATED_FILE = Path(__file__).resolve().parents[2] / "data" / "book_page_counts.json"
# Anything shorter than this is a data-entry error (several books had a
# page count of 1), not a real omnibus/absolute edition. Open Library also
# has some omnibus records with a single issue's count (Batman By Paul Dini
# Omnibus: 125), so omnibuses get a higher floor - the shortest real one
# in the catalog is 224 pages (Planet Of The Apes Adventures Omnibus).
MIN_PLAUSIBLE_PAGES = 40
MIN_PLAUSIBLE_OMNIBUS_PAGES = 200
OMNIBUS_RE = re.compile(r"\b(?:Omnibus|Minibus|Zomnibus|Venomnibus|Monsterbus)\b", re.IGNORECASE)

# Everything up to "Omnibus"/"Minibus" (+ "Vol. N") identifies the edition;
# what follows is cover/printing detail ("Dm Kirby Cvr New Ptg").
EDITION_RE = re.compile(
    r"^(.*?\b(?:Omnibus|Minibus|Zomnibus|Venomnibus)(?: Vol\. \d+)?)\b", re.IGNORECASE
)


def is_plausible(book, pages):
    floor = MIN_PLAUSIBLE_OMNIBUS_PAGES if OMNIBUS_RE.search(book.title) else MIN_PLAUSIBLE_PAGES
    return bool(pages) and pages >= floor


def edition_key(book):
    match = EDITION_RE.match(book.title)
    return (book.publisher_id, match.group(1).lower()) if match else None


class Command(BaseCommand):
    help = "Fill in book page counts from Open Library / Google Books by ISBN"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Look everything up and print what would change without saving",
        )
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Also replace existing page counts when a lookup finds one",
        )
        parser.add_argument(
            "--curated-only",
            action="store_true",
            help="Only apply the curated data file (plus variant-cover copying) - skip the ISBN APIs",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        overwrite = options["overwrite"]
        curated_only = options["curated_only"]
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})

        def needs_count(book):
            return overwrite or not is_plausible(book, book.page_count)

        books = list(Book.objects.all())
        targets = [b for b in books if needs_count(b)]
        isbns = sorted({b.isbn.strip() for b in targets if b.isbn and b.isbn.strip()})
        self.stdout.write(f"{len(targets)} book(s) to fill, {len(isbns)} distinct ISBN(s) to look up")

        updates = {}
        curated = json.loads(CURATED_FILE.read_text()) if CURATED_FILE.exists() else {}
        for book in targets:
            pages = curated.get(book.title)
            if is_plausible(book, pages):
                updates[book.id] = (book, pages, "curated")
        self.stdout.write(f"Curated file: {len(updates)} matched")

        pages_by_isbn = {}
        if curated_only:
            self.stdout.write("ISBN lookups: skipped (--curated-only)")
        else:
            isbns = [i for i in isbns if not any(
                b.id in updates for b in targets if (b.isbn or "").strip() == i
            )]
            pages_by_isbn = self.lookup_open_library(isbns)
            self.stdout.write(f"Open Library: {len(pages_by_isbn)} found")

            api_key = os.environ.get("GOOGLE_BOOKS_API_KEY")
            if api_key:
                remaining = [i for i in isbns if i not in pages_by_isbn]
                found = self.lookup_google_books(remaining, api_key)
                pages_by_isbn.update(found)
                self.stdout.write(f"Google Books: {len(found)} found")
            else:
                self.stdout.write("Google Books: skipped (GOOGLE_BOOKS_API_KEY not set)")

        for book in targets:
            pages = pages_by_isbn.get((book.isbn or "").strip())
            if book.id not in updates and is_plausible(book, pages):
                updates[book.id] = (book, pages, "isbn")

        # Variant-cover siblings share contents, so share page counts
        counts_by_edition = defaultdict(set)
        for book in books:
            key = edition_key(book)
            pages = updates[book.id][1] if book.id in updates else book.page_count
            if key and is_plausible(book, pages):
                counts_by_edition[key].add(pages)
        for book in targets:
            key = edition_key(book)
            if book.id in updates or not key:
                continue
            counts = counts_by_edition.get(key, set())
            # Only copy when every sibling agrees - conflicting counts mean
            # the "edition" match is too loose to trust
            if len(counts) == 1:
                updates[book.id] = (book, next(iter(counts)), "variant")

        changed = 0
        for book, pages, source in sorted(updates.values(), key=lambda u: u[0].title):
            if book.page_count == pages:
                continue
            old = f" (was {book.page_count})" if book.page_count else ""
            self.stdout.write(f"  {book.title}: {pages}{old} [{source}]")
            if not dry_run:
                book.page_count = pages
                book.save(update_fields=["page_count"])
            changed += 1

        missing = [b for b in targets if b.id not in updates]
        self.stdout.write(f"\nStill missing ({len(missing)}):")
        for book in sorted(missing, key=lambda b: b.title):
            self.stdout.write(f"  {book.title} [isbn {book.isbn or '-'}]")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone ({'dry run, nothing saved' if dry_run else 'saved'}). "
            f"Updated: {changed}  Still missing: {len(missing)}"
        ))

    def lookup_open_library(self, isbns):
        found = {}
        for start in range(0, len(isbns), OPEN_LIBRARY_BATCH):
            chunk = isbns[start:start + OPEN_LIBRARY_BATCH]
            response = self.session.get(OPEN_LIBRARY_URL, params={
                "bibkeys": ",".join(f"ISBN:{isbn}" for isbn in chunk),
                "format": "json",
                "jscmd": "data",
            }, timeout=60)
            response.raise_for_status()
            for key, record in response.json().items():
                pages = record.get("number_of_pages")
                if pages and pages >= MIN_PLAUSIBLE_PAGES:
                    found[key.removeprefix("ISBN:")] = pages
            time.sleep(1)
        return found

    def lookup_google_books(self, isbns, api_key):
        found = {}
        failed = 0
        for index, isbn in enumerate(isbns, 1):
            if index % 100 == 0:
                self.stdout.write(f"  Google Books: {index}/{len(isbns)} looked up, {len(found)} found")
            # Google Books returns intermittent 5xx under load - retry with
            # backoff, then skip just this ISBN rather than losing the run
            response = None
            for attempt in range(4):
                try:
                    response = self.session.get(GOOGLE_BOOKS_URL, params={
                        "q": f"isbn:{isbn}", "key": api_key,
                    }, timeout=30)
                except requests.RequestException:
                    response = None  # timeout/connection reset - retry like a 5xx
                if response is not None and response.status_code < 500:
                    break
                time.sleep(2 ** (attempt + 1))
            if response is None:
                failed += 1
                self.stdout.write(self.style.WARNING(f"  Google Books: no response for {isbn} after retries - skipping"))
                continue
            if response.status_code in (403, 429):
                # Bad/restricted key or quota exhausted - every remaining
                # request would fail the same way, so keep what we have
                message = response.json().get("error", {}).get("message", response.text[:200])
                self.stdout.write(self.style.WARNING(
                    f"  Google Books {response.status_code} - stopping lookups: {message}"
                ))
                break
            if not response.ok:
                failed += 1
                self.stdout.write(self.style.WARNING(
                    f"  Google Books {response.status_code} for {isbn} after retries - skipping"
                ))
                continue
            for item in response.json().get("items", []):
                pages = item.get("volumeInfo", {}).get("pageCount")
                if pages and pages >= MIN_PLAUSIBLE_PAGES:
                    found[isbn] = pages
                    break
            time.sleep(0.5)
        if failed:
            self.stdout.write(self.style.WARNING(f"  Google Books: {failed} ISBN(s) skipped after errors - re-run to retry them"))
        return found
