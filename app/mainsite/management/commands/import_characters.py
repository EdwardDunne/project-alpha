"""
Imports DC characters by scraping superheroes.fandom.com and Marvel
characters from a local JSON export.

Usage examples:
    python manage.py import_characters --publisher dc --dry-run
    python manage.py import_characters --publisher marvel --marvel-json /usr/src/app/all-marvel-characters.json
    python manage.py import_characters

The Marvel JSON file lives at the project root, outside the web
container's bind mount (./app/ -> /usr/src/app/), so it has to be copied
in first:
    docker compose cp all-marvel-characters.json web:/usr/src/app/all-marvel-characters.json

DC character names are read from
https://superheroes.fandom.com/wiki/List_of_DC_Comics_Characters, where
every character is a <li> inside a <ul> inside the article's content div
(<div class="mw-content-ltr mw-parser-output" lang="en" dir="ltr">). The
<li>'s italics/link markup varies (<i> wrapping <a>, <a> wrapping <i>,
plain text, or a redlink <span class="new">), but in every case the
<li>'s own text (excluding any nested sub-<ul>) is exactly the character
name, so no per-case markup handling is needed - just the text.
"""
import json
import random
import time

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand, CommandError

from mainsite.models import Character, Publisher

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

DC_PAGE = "List_of_DC_Comics_Characters"
# The plain wiki page is behind a Cloudflare JS challenge that a plain
# `requests` client can never pass. The MediaWiki action API renders the
# same article body server-side and isn't behind that challenge, so fetch
# the article through it instead.
DC_API_URL = "https://superheroes.fandom.com/api.php"
DEFAULT_MARVEL_JSON = "/usr/src/app/all-marvel-characters.json"


def li_own_text(li):
    """Text of a <li>'s own line, stopping before any nested sub-<ul> so a
    sub-list's items aren't concatenated onto their parent's name."""
    parts = []
    for child in li.children:
        if getattr(child, "name", None) == "ul":
            break
        parts.append(child.get_text() if hasattr(child, "get_text") else str(child))
    return " ".join("".join(parts).split())


def normalize_case(name):
    """Fix shouty-case entries (e.g. 'GREEN ARROW' -> 'Green Arrow') while
    leaving already mixed-case names (which may contain acronyms like
    'Ares (DC)') untouched."""
    return name.title() if name.isupper() else name


class Command(BaseCommand):
    help = "Import DC characters (scraped) and Marvel characters (from local JSON) into the DB"

    def add_arguments(self, parser):
        parser.add_argument(
            "--publisher",
            choices=["dc", "marvel", "both"],
            default="both",
            help="Which publisher's characters to import (default: both)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Parse and print what would be created, without writing to the DB",
        )
        parser.add_argument(
            "--marvel-json",
            default=DEFAULT_MARVEL_JSON,
            help=f"Path to the Marvel characters JSON file (default: {DEFAULT_MARVEL_JSON})",
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
        self.delay_min = options["delay_min"]
        self.delay_max = options["delay_max"]

        if self.delay_min < 0 or self.delay_max < self.delay_min:
            raise CommandError("--delay-max must be >= --delay-min >= 0")

        publishers = (
            ["dc", "marvel"] if options["publisher"] == "both" else [options["publisher"]]
        )

        if "dc" in publishers:
            self.import_dc()
        if "marvel" in publishers:
            self.import_marvel(options["marvel_json"])

    # -- shared --------------------------------------------------------

    def get_or_create_character(self, name, publisher, created_count, skipped_count):
        name = name.strip()
        if not name:
            return created_count, skipped_count

        if self.dry_run:
            exists = Character.objects.filter(name=name, publisher=publisher).exists()
            if exists:
                return created_count, skipped_count + 1
            self.stdout.write(f"  Would create: {name}")
            return created_count + 1, skipped_count

        _, was_created = Character.objects.get_or_create(name=name, publisher=publisher)
        if was_created:
            return created_count + 1, skipped_count
        return created_count, skipped_count + 1

    # -- DC --------------------------------------------------------------

    def import_dc(self):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== DC Comics ==="))
        try:
            publisher = Publisher.objects.get(name="DC Comics")
        except Publisher.DoesNotExist:
            raise CommandError("Publisher 'DC Comics' not found in the DB.")

        time.sleep(random.uniform(self.delay_min, self.delay_max))
        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})
        response = session.get(
            DC_API_URL,
            params={"action": "parse", "page": DC_PAGE, "format": "json", "prop": "text"},
            timeout=30,
        )
        response.raise_for_status()
        html = response.json()["parse"]["text"]["*"]
        soup = BeautifulSoup(html, "html.parser")

        content_div = soup.find(
            "div",
            class_="mw-content-ltr mw-parser-output",
            attrs={"lang": "en", "dir": "ltr"},
        )
        if content_div is None:
            raise CommandError(
                "Could not find the expected content div on the DC characters page - "
                "the page structure may have changed."
            )

        # The article's own table of contents lives inside this same div and
        # is itself a <ul><li> list (of section headers, not characters) -
        # drop it before scanning for character <li>s.
        toc = content_div.find("div", id="toc")
        if toc is not None:
            toc.extract()

        created_count = 0
        skipped_count = 0
        for li in content_div.find_all("li"):
            name = normalize_case(li_own_text(li))
            if not name:
                continue
            created_count, skipped_count = self.get_or_create_character(
                name, publisher, created_count, skipped_count
            )

        self.stdout.write(self.style.SUCCESS(
            f"DC Comics done. Created: {created_count}  Skipped (duplicate): {skipped_count}"
        ))

    # -- Marvel ------------------------------------------------------------

    def import_marvel(self, json_path):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== Marvel Comics ==="))
        try:
            publisher = Publisher.objects.get(name="Marvel Comics")
        except Publisher.DoesNotExist:
            raise CommandError("Publisher 'Marvel Comics' not found in the DB.")

        try:
            with open(json_path) as f:
                data = json.load(f)
        except FileNotFoundError:
            raise CommandError(
                f"Marvel JSON file not found at {json_path!r}. Copy it into the "
                "container first, e.g.:\n"
                "  docker compose cp all-marvel-characters.json "
                f"web:{DEFAULT_MARVEL_JSON}"
            )

        created_count = 0
        skipped_count = 0
        for item in data:
            headline = item.get("headline")
            if not headline:
                continue
            name = normalize_case(headline.strip())
            if not name:
                continue
            created_count, skipped_count = self.get_or_create_character(
                name, publisher, created_count, skipped_count
            )

        self.stdout.write(self.style.SUCCESS(
            f"Marvel Comics done. Created: {created_count}  Skipped (duplicate): {skipped_count}"
        ))
