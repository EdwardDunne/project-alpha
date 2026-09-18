"""
Scans every book's title for character names and links matches onto the
book's `characters` M2M - only characters belonging to that book's own
publisher are considered, so a DC book's title can't accidentally pick up
a same-named Marvel character (or vice versa).

Usage:
    python manage.py link_characters_to_books --dry-run
    python manage.py link_characters_to_books
"""
import re
from collections import defaultdict

from django.core.management.base import BaseCommand

from mainsite.models import Book, Character


class Command(BaseCommand):
    help = "Link characters to books by matching character names against book titles (same publisher only)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would be linked without writing to the DB",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        characters_by_publisher = defaultdict(list)
        skipped_short = 0
        for character in Character.objects.select_related("publisher"):
            # Many imported names are short, generic English words ("War",
            # "Box", "Set", "A", "Cat") rather than distinctive character
            # names - matched literally against titles, these produce
            # obviously-wrong links (e.g. "Civil War Box Set Slipcase" ->
            # War/Box/Set). Requiring either some length or multiple words
            # filters those out while keeping every multi-word or
            # longer-single-word name (Batman, Robin, Green Arrow, ...).
            if len(character.name) < 4 and len(character.name.split()) < 2:
                skipped_short += 1
                continue
            pattern = re.compile(
                r"\b" + re.escape(character.name) + r"\b", re.IGNORECASE
            )
            characters_by_publisher[character.publisher_id].append((character, pattern))

        books_matched = 0
        links_created = 0

        for book in Book.objects.filter(publisher__isnull=False).prefetch_related("characters"):
            existing_ids = {c.id for c in book.characters.all()}
            matches = [
                character
                for character, pattern in characters_by_publisher.get(book.publisher_id, [])
                if pattern.search(book.title)
            ]
            new_matches = [c for c in matches if c.id not in existing_ids]
            if not new_matches:
                continue

            books_matched += 1
            names = ", ".join(c.name for c in new_matches)
            self.stdout.write(f"  {book.title}: {'would link' if dry_run else 'linking'} {names}")

            if not dry_run:
                book.characters.add(*new_matches)
            links_created += len(new_matches)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Books matched: {books_matched}  "
            f"{'Would create' if dry_run else 'Created'} links: {links_created}  "
            f"Skipped (name too short/generic): {skipped_short}"
        ))
