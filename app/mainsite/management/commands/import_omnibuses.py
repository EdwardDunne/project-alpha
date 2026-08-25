"""
Bulk-imports DC/Marvel omnibus and absolute edition books by scraping
cheapgraphicnovels.com.

Usage examples:
    python manage.py import_omnibuses --publisher dc --dry-run --limit 5
    python manage.py import_omnibuses --publisher marvel --limit 5
    python manage.py import_omnibuses

Each category listing page tags every real grid product with a
`data-ga-ec-action` tracking attribute whose JSON payload includes
`"list": "category"` (as opposed to sidebar widgets like "New Arrivals",
which are tagged with other list names but otherwise look identical). That
field is the reliable way to tell real grid products apart from unrelated
widgets on the same page - relying on a generic CSS class alone pulls in
both.
"""
import json
import random
import re
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError

from mainsite.models import Artist, Author, Book, Format, Publisher

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

# A handful of well-known comics-industry surnames with internal capitals
# that a naive word-by-word title-case would get wrong (e.g.
# "MCFARLANE".title() -> "Mcfarlane"). Not exhaustive - extend as needed.
NAME_OVERRIDES = {
    "mcfarlane": "McFarlane",
    "macfarlane": "MacFarlane",
    "mckean": "McKean",
    "mcguinness": "McGuinness",
    "mcdaniel": "McDaniel",
    "mccrea": "McCrea",
    "mcniven": "McNiven",
    "mcduffie": "McDuffie",
    "mckone": "McKone",
    "mcmanus": "McManus",
    "mackay": "MacKay",
    "mcleod": "McLeod",
}

# Roman-numeral name suffixes (e.g. "J.H. WILLIAMS III") should stay fully
# uppercase rather than being title-cased to "Iii".
ROMAN_NUMERALS = {"II", "III", "IV", "V", "VI", "VII", "VIII", "IX"}

# The site occasionally has data-entry mistakes where the publisher name gets
# concatenated onto the end of a credit with no separator, e.g. a raw Artist
# value of "David Finch, Chris Burnham, Frazer Irving, Cameron Stewart DC
# COMICS". Strip a trailing publisher label rather than importing it as part
# of the last name.
TRAILING_PUBLISHER_LABELS = ("DC COMICS", "MARVEL COMICS")

# Whole-credit fixes for known upstream data errors that word-by-word
# normalization can't catch - e.g. the site's own raw text has the roman
# numeral suffix transposed into the middle of the name ("JAMES IV TYNION"
# instead of "JAMES TYNION IV"). Matched case-insensitively against the full
# split name before per-word normalization.
FULL_NAME_OVERRIDES = {
    "james iv tynion": "James Tynion IV",
}

# Binding codes dropped from titles (redundant once Format is tracked
# separately) and edition/date tags dropped as clutter. Cover-variant tags
# (e.g. "DAVIS CVR", "KANE CVR", "DM STARLIN CVR") are deliberately NOT
# touched here - two different cover variants of the same book are
# separately purchasable editions with different ISBNs, and collapsing them
# onto the same title would corrupt the title-based dedup this command
# relies on.
BINDING_CODES = {"HC", "TP", "SC", "GN"}

PUBLISHER_CONFIGS = {
    "dc": {
        "root_url": "https://cheapgraphicnovels.com/dc-comics/",
        "category_path": "absolute-omnibus-editions/",
        "publisher_name": "DC Comics",
        "site_publisher_label": "DC COMICS",
        # The site's own Publisher field on the detail page is inconsistent
        # for imprints ("DC", "DC COMICS", "DC COMICS / VERTIGO", "DC /
        # AMERICA'S BEST COMICS" have all been seen for genuine DC books).
        # Checking against just the short prefix is far more robust than
        # trying to enumerate every imprint combination.
        "publisher_prefix": "DC",
    },
    "marvel": {
        "root_url": "https://cheapgraphicnovels.com/marvel-comics/",
        "category_path": "omnibus-editions/",
        "publisher_name": "Marvel Comics",
        "site_publisher_label": "MARVEL COMICS",
        "publisher_prefix": "MARVEL",
    },
}


def normalize_word(word):
    """Title-case a single word, with overrides for known Mc/Mac names,
    roman-numeral suffixes (III -> III, not Iii), and trailing possessives
    (WORLD'S -> World's, not World'S - str.title() gets this one wrong,
    though it correctly handles name-internal apostrophes like O'NEIL -> O'Neil
    on its own)."""
    override = NAME_OVERRIDES.get(word.lower().strip("."))
    if override:
        # Preserve a trailing period if the original word had one (e.g. "JR.")
        return override + ("." if word.endswith(".") else "")
    if word.upper() in ROMAN_NUMERALS:
        return word.upper()
    titled = word.title()
    if titled.endswith("'S"):
        titled = titled[:-1] + "s"
    return titled


def normalize_name(raw_name):
    """'FRANK MILLER' -> 'Frank Miller'"""
    for label in TRAILING_PUBLISHER_LABELS:
        if raw_name.upper().endswith(label):
            raw_name = raw_name[: -len(label)].strip()

    override = FULL_NAME_OVERRIDES.get(raw_name.strip().lower())
    if override:
        return override

    return " ".join(normalize_word(w) for w in raw_name.strip().split())


def clean_title(raw_title):
    """'100 BULLETS OMNIBUS VOL 01 HC' -> '100 Bullets Omnibus Vol. 1'

    Drops standalone binding codes (HC/TP/SC/GN) and "NEW ED"/"<year> ED"
    edition tags wherever they appear, abbreviates "VOL 01" -> "Vol. 1",
    and title-cases everything else. Deliberately leaves cover-variant tags
    (e.g. "DAVIS CVR") untouched - see BINDING_CODES comment."""
    tokens = raw_title.strip().split()
    cleaned = []
    i = 0
    while i < len(tokens):
        token = tokens[i]
        upper = token.upper()

        # "NEW ED" / "<year> ED"
        if (
            i + 1 < len(tokens)
            and tokens[i + 1].upper() == "ED"
            and (upper == "NEW" or re.fullmatch(r"\d{4}", token))
        ):
            i += 2
            continue

        # Standalone binding code
        if upper in BINDING_CODES:
            i += 1
            continue

        # "VOL 01" -> "Vol. 1"
        if upper == "VOL" and i + 1 < len(tokens) and tokens[i + 1].isdigit():
            cleaned.append(f"Vol. {int(tokens[i + 1])}")
            i += 2
            continue

        cleaned.append(normalize_word(token))
        i += 1

    return " ".join(cleaned)


def split_names(raw_names):
    """'A, B and C' / 'A and B' / 'A & B' -> ['A', 'B', 'C']"""
    if not raw_names:
        return []
    # Normalize " and "/" & " (with an optional leading Oxford comma) into a
    # plain comma delimiter first, so a single split on "," handles every
    # form consistently - doing it in one pass avoids the Oxford comma
    # ", and " being partially consumed by a comma-only split, which would
    # otherwise leave a stray "and Last Name" un-split.
    normalized = re.sub(
        r"\s*,?\s+and\s+|\s*&\s*|\s+with\s+",
        ", ",
        raw_names.strip(),
        flags=re.IGNORECASE,
    )
    parts = normalized.split(",")
    return [normalize_name(p) for p in parts if p.strip()]


class Command(BaseCommand):
    help = "Scrape DC/Marvel omnibus + absolute edition books from cheapgraphicnovels.com"

    def add_arguments(self, parser):
        parser.add_argument(
            "--publisher",
            choices=["dc", "marvel", "both"],
            default="both",
            help="Which publisher's catalog to import (default: both)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Scrape and print what would be created, without writing to the DB or downloading images",
        )
        parser.add_argument(
            "--limit",
            type=int,
            default=None,
            help="Stop after this many new books have been processed (across the whole run)",
        )
        parser.add_argument(
            "--delay-min",
            type=float,
            default=2.0,
            help="Minimum seconds to wait before each HTTP request (default: 2.0)",
        )
        parser.add_argument(
            "--delay-max",
            type=float,
            default=5.0,
            help="Maximum seconds to wait before each HTTP request (default: 5.0)",
        )

    def handle(self, *args, **options):
        self.dry_run = options["dry_run"]
        self.limit = options["limit"]
        self.delay_min = options["delay_min"]
        self.delay_max = options["delay_max"]

        if self.delay_min < 0 or self.delay_max < self.delay_min:
            raise CommandError("--delay-max must be >= --delay-min >= 0")

        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            # Required for pagination (?pageId=N) to actually return that
            # page's content - without it the server silently falls back to
            # page 1's content while still rendering a "next page" link,
            # which causes an infinite loop of re-fetching the same page.
            "X-Requested-With": "XMLHttpRequest",
        })

        self.created_count = 0
        self.skipped_duplicate_count = 0
        self.skipped_invalid_count = 0
        self.error_count = 0

        publishers = (
            ["dc", "marvel"] if options["publisher"] == "both" else [options["publisher"]]
        )

        for publisher_key in publishers:
            if self.limit is not None and self.created_count >= self.limit:
                break
            self.import_publisher(publisher_key)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Created: {self.created_count}  "
            f"Skipped (duplicate): {self.skipped_duplicate_count}  "
            f"Skipped (invalid): {self.skipped_invalid_count}  "
            f"Errors: {self.error_count}"
        ))

    # -- networking --------------------------------------------------

    def polite_delay(self):
        time.sleep(random.uniform(self.delay_min, self.delay_max))

    def get_soup(self, url, referer=None):
        self.polite_delay()
        headers = {"Referer": referer} if referer else {}
        response = self.session.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.content, "html.parser")

    # -- listing pages -------------------------------------------------

    def iter_listing_products(self, config):
        """Yields (title, detail_url) for every real grid product across all
        pages of a publisher's category, validating each page as it goes."""
        root_url = config["root_url"]
        category_url = urljoin(root_url, config["category_path"])
        page_url = category_url
        page_num = 1
        seen_page_urls = set()

        while page_url:
            if page_url in seen_page_urls:
                # Defense-in-depth: if the "next page" link ever points back
                # to a page we've already fetched (seen once, for real -
                # this exact bug happened when a required header was
                # missing and the server silently kept re-serving page 1),
                # stop instead of looping forever.
                self.stdout.write(self.style.ERROR(
                    f"  Pagination loop detected at page {page_num} "
                    f"({page_url}) - stopping."
                ))
                break
            seen_page_urls.add(page_url)

            self.stdout.write(f"  Fetching listing page {page_num}: {page_url}")
            soup = self.get_soup(page_url, referer=category_url)

            products = self.parse_listing_page(soup, config, root_url)
            if not products:
                self.stdout.write(self.style.WARNING(
                    f"  No valid products found on page {page_num} - stopping."
                ))
                break

            for title, detail_url in products:
                yield title, detail_url

            page_url = self.next_page_url(soup, root_url)
            page_num += 1

    def parse_listing_page(self, soup, config, root_url):
        expected_label = config["site_publisher_label"]
        products = []
        for script in soup.find_all("script", attrs={"data-ga-ec-action": True}):
            try:
                data = json.loads(script["data-ga-ec-action"])
            except (ValueError, KeyError):
                continue

            item = data.get("data", {})
            if item.get("list") != "category":
                continue  # sidebar widget (e.g. "New Arrivals"), not the real grid

            category = item.get("category", "")
            if expected_label not in category.upper():
                # Data-quality safety net, not an anti-bot defense - just
                # skip anything that doesn't actually belong to this publisher.
                self.skipped_invalid_count += 1
                continue

            container = script.find_parent("div", class_="product")
            link = container.find("a", class_="fn url") if container else None
            if not link or not link.get("href"):
                continue

            title = clean_title(item.get("name", ""))
            detail_url = urljoin(root_url, link["href"])
            products.append((title, detail_url))

        return products

    def next_page_url(self, soup, root_url):
        pager = soup.find("div", class_="list-pager")
        if not pager:
            return None
        next_li = pager.find("li", class_="next-page")
        if not next_li or "disabled" in next_li.get("class", []):
            return None
        link = next_li.find("a")
        if not link or not link.get("href"):
            return None
        return urljoin(root_url, link["href"])

    # -- detail pages ----------------------------------------------------

    def parse_detail_page(self, soup):
        fields = {}
        for extra in soup.find_all("ul", class_="extra-fields"):
            for li in extra.find_all("li"):
                label_div = li.find("div")
                label = label_div.find("strong") if label_div else None
                value = li.find("span", class_="textarea")
                if label and value:
                    fields[label.get_text(strip=True)] = value.get_text(" ", strip=True)

        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else None

        image = soup.find("img", id=lambda x: x and x.startswith("product_image_"))
        image_url = None
        if image and image.get("data-src"):
            image_url = "https:" + image["data-src"] if image["data-src"].startswith("//") else image["data-src"]

        description_div = soup.find("div", class_="product-description")
        description = description_div.get_text(" ", strip=True) if description_div else ""

        return {
            "title": title,
            "publisher_label": fields.get("Publisher", ""),
            "writer": fields.get("Writer", ""),
            "artist": fields.get("Artist", ""),
            "isbn": fields.get("ISBN", ""),
            "image_url": image_url,
            "description": description,
        }

    # -- orchestration -----------------------------------------------------

    def import_publisher(self, publisher_key):
        config = PUBLISHER_CONFIGS[publisher_key]
        self.stdout.write(self.style.MIGRATE_HEADING(f"\n=== {config['publisher_name']} ==="))

        try:
            publisher = Publisher.objects.get(name=config["publisher_name"])
        except Publisher.DoesNotExist:
            raise CommandError(
                f"Publisher '{config['publisher_name']}' not found in the DB. "
                "Create it first via the admin page."
            )

        try:
            omnibus_format = Format.objects.get(name="Omnibus")
            absolute_format = Format.objects.get(name="Absolute")
        except Format.DoesNotExist as e:
            raise CommandError(f"Required Format missing from the DB: {e}")

        for title, detail_url in self.iter_listing_products(config):
            if self.limit is not None and self.created_count >= self.limit:
                self.stdout.write(f"  Reached --limit {self.limit}, stopping.")
                return

            if Book.objects.filter(title=title).exists():
                self.stdout.write(f"  Skip (duplicate): {title}")
                self.skipped_duplicate_count += 1
                continue

            try:
                self.import_book(
                    title, detail_url, publisher, config, omnibus_format, absolute_format
                )
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  Error on '{title}': {e}"))
                self.error_count += 1

    def import_book(self, listing_title, detail_url, publisher, config, omnibus_format, absolute_format):
        soup = self.get_soup(detail_url)
        data = self.parse_detail_page(soup)

        # listing_title is already cleaned (see parse_listing_page); the
        # detail page's own <h1> needs the same cleaning applied.
        title = clean_title(data["title"]) if data["title"] else listing_title
        if not title:
            self.stdout.write(self.style.WARNING(f"  Skip (no title found): {detail_url}"))
            self.skipped_invalid_count += 1
            return

        # Just check the short publisher prefix, not the full label - the
        # site is inconsistent across imprints ("DC", "DC COMICS", "DC
        # COMICS / VERTIGO", "DC / AMERICA'S BEST COMICS" have all been seen
        # for genuine DC books), but every variant starts with "DC".
        scraped_publisher = data["publisher_label"].strip().upper()
        if not scraped_publisher.startswith(config["publisher_prefix"]):
            self.stdout.write(self.style.WARNING(
                f"  Skip (unexpected publisher '{data['publisher_label']}'): {title}"
            ))
            self.skipped_invalid_count += 1
            return

        is_absolute = "ABSOLUTE" in title.upper() and config["publisher_name"] == "DC Comics"
        book_format = absolute_format if is_absolute else omnibus_format

        writers = split_names(data["writer"])
        artists = split_names(data["artist"])

        self.stdout.write(
            f"  {title}\n"
            f"    format={book_format.name} isbn={data['isbn']!r} "
            f"writers={writers} artists={artists}"
        )

        if self.dry_run:
            self.created_count += 1
            return

        book = Book(
            title=title,
            description=data["description"],
            publisher=publisher,
            format=book_format,
            isbn=data["isbn"] or None,
        )
        book.save()

        for name in writers:
            author, _ = Author.objects.get_or_create(name=name)
            book.authors.add(author)
        for name in artists:
            artist, _ = Artist.objects.get_or_create(name=name)
            book.artists.add(artist)

        if data["image_url"]:
            self.attach_image(book, data["image_url"])

        self.created_count += 1

    def attach_image(self, book, image_url):
        self.polite_delay()
        response = self.session.get(image_url, timeout=30)
        response.raise_for_status()
        filename = image_url.rsplit("/", 1)[-1].split("?")[0]
        book.thumbnail.save(filename, ContentFile(response.content), save=True)
