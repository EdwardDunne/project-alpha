"""
Cleans up after link_characters_to_books, which matched character names
literally against titles: it linked generic words ("Ghost", "Infinity",
"Force"), cover artists ("Geiger", "Bengal") and the wrong character with
a similar name (Hulk on She-Hulk books, Mar-Vell on Carol Danvers books).
Also merges duplicate characters from the import (case-only, "The ..."
prefix, and alias pairs like Sub-Mariner/Namor) into one row.

Removals run before merges so a junk link on a duplicate isn't carried onto
the canonical character. Everything is keyed by name/title, so it can be
run against prod as well.

Usage:
    python manage.py fix_character_links --dry-run
    python manage.py fix_character_links
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from mainsite.models import Book, Character, Team

DC = "DC Comics"
MARVEL = "Marvel Comics"
ALL_BOOKS = "*"

# (character publisher, character name, title substrings to unlink from -
# ALL_BOOKS unlinks it everywhere). Substrings are matched case-insensitively.
REMOVALS = [
    # Generic words / cover artists - never a real match
    *[
        (MARVEL, name, [ALL_BOOKS])
        for name in [
            "Agent", "Armor", "Bengal", "Bounty", "Dawn", "Death", "Destroyer",
            "Dust", "Eternals", "Force", "Fury", "Gauntlet", "Geiger", "Genesis",
            "Ghost", "Grey", "Inferno", "Infinity", "Jack", "Krakoa", "Menace",
            "Messiah", "Morrow", "Mutant", "Omega", "Origin", "Post", "Random",
            "Sway", "Vengeance", "Warlock", "Weapon X", "X-Treme", "Zero",
        ]
    ],
    (DC, "Wrath", [ALL_BOOKS]),
    (DC, "Death", ["Death Of The Family", "Death Metal", "Death Of Superman", "Death And Return"]),
    (DC, "Steel", ["Man Of Steel"]),
    (DC, "Doomsday", ["Doomsday Clock"]),
    (DC, "Batman", ["Before Batman"]),
    (DC, "Superman", ["Spider-man by Michelinie"]),
    # Right name, wrong character. Bare "Spider-Man", "Wolverine", etc. are
    # generics now (see assign_generic_characters), so they're deliberately
    # NOT removed from their variants' books (Miles Morales, X-23, ...).
    (MARVEL, "Thing", ["Man-Thing"]),
    (MARVEL, "Hulk", ["She-Hulk"]),
    (MARVEL, "Wolverine", ["Spider-Man By Todd McFarlane"]),
    (MARVEL, "Doom", ["Doom 2099"]),
]

# (publisher, duplicate name, canonical name)
MERGES = [
    (MARVEL, "Spider-man", "Spider-Man"),
    (MARVEL, "The Amazing Spider-Man", "Spider-Man"),
    (MARVEL, "Sub-Mariner", "Namor"),
    (MARVEL, "The Mighty Thor", "Thor"),
    (MARVEL, "Doom", "Doctor Doom"),
    (MARVEL, "Venomm", "Venom"),
    (MARVEL, "The Punisher", "Punisher"),
    (MARVEL, "The Thing", "Thing"),
    (MARVEL, "The Wasp", "Wasp"),
    (MARVEL, "TItania", "Titania"),
    (MARVEL, "Leap-Frog", "Leapfrog"),
    (MARVEL, "Miracle Man", "Miracleman"),
    (MARVEL, "Star-Thief", "Star Thief"),
    (MARVEL, "Otto Octavius", "Doctor Octopus"),
    (DC, "Constantine", "John Constantine"),
]


class Command(BaseCommand):
    help = "Remove bad title-matched character links and merge duplicate characters"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change, then roll everything back",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        links_removed = 0
        merged = 0

        with transaction.atomic():
            self.stdout.write("Removing bad links:")
            for publisher, name, title_patterns in REMOVALS:
                character = self._get(publisher, name)
                if character is None:
                    continue
                books = character.book_set.all()
                if ALL_BOOKS not in title_patterns:
                    books = [
                        book for book in books
                        if any(p.lower() in book.title.lower() for p in title_patterns)
                    ]
                for book in books:
                    self.stdout.write(f"  {book.title}: -{name}")
                    book.characters.remove(character)
                    links_removed += 1

            self.stdout.write("\nMerging duplicates:")
            for publisher, duplicate_name, canonical_name in MERGES:
                duplicate = self._get(publisher, duplicate_name)
                canonical = self._get(publisher, canonical_name)
                if duplicate is None or canonical is None:
                    continue
                books = list(duplicate.book_set.all())
                teams = list(Team.objects.filter(characters=duplicate))
                for book in books:
                    book.characters.add(canonical)
                for team in teams:
                    team.characters.add(canonical)
                self.stdout.write(
                    f"  {duplicate_name} -> {canonical_name} "
                    f"({len(books)} books, {len(teams)} teams)"
                )
                duplicate.delete()
                merged += 1

            if dry_run:
                transaction.set_rollback(True)

        self.stdout.write(self.style.SUCCESS(
            f"\nDone ({'dry run, rolled back' if dry_run else 'committed'}). "
            f"Links removed: {links_removed}  Characters merged: {merged}"
        ))

    def _get(self, publisher, name):
        # Exact (case-sensitive) match on purpose - "Spider-man" and
        # "Spider-Man" are the two rows being merged.
        character = Character.objects.filter(name=name, publisher__name=publisher).first()
        if character is None:
            self.stdout.write(self.style.WARNING(f"  Not found: {name} ({publisher})"))
        return character
