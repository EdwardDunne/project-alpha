"""
Assigns each book's main character(s) and/or team from a curated data file
(mainsite/data/book_main_characters.json). Unlike link_characters_to_books,
which guesses from title text, this file was built by hand per book, so it
covers books whose lead isn't named in the title (Preacher -> Jesse Custer,
Green Lantern -> Hal Jordan) and team books (X-Men, Avengers, ...).

Books are matched by (title, publisher) rather than id so the same file can
be run against prod, where ids differ. Characters/teams that don't exist yet
are created. Existing character links are kept - this only adds - and a
book's team is only set when it doesn't already have one.

Usage:
    python manage.py assign_main_characters --dry-run
    python manage.py assign_main_characters
"""
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from mainsite.models import Book, Character, Publisher, Team

DATA_FILE = Path(__file__).resolve().parents[2] / "data" / "book_main_characters.json"


class Command(BaseCommand):
    help = "Assign main characters/teams to books from mainsite/data/book_main_characters.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change, then roll everything back",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        entries = json.loads(DATA_FILE.read_text())

        self.created_characters = []
        self.created_teams = []
        books_updated = 0
        links_created = 0
        teams_set = 0
        not_found = []
        team_conflicts = []

        with transaction.atomic():
            publishers = {p.name: p for p in Publisher.objects.all()}

            for entry in entries:
                publisher = publishers.get(entry["publisher"])
                book = (
                    Book.objects.filter(title=entry["title"], publisher=publisher)
                    .prefetch_related("characters")
                    .select_related("team")
                    .first()
                )
                if book is None:
                    not_found.append(entry["title"])
                    continue

                existing_ids = {c.id for c in book.characters.all()}
                new_characters = [
                    character
                    for character in (
                        self._get_or_create_character(name, publisher)
                        for name in entry.get("characters", [])
                    )
                    if character.id not in existing_ids
                ]

                team = None
                if entry.get("team"):
                    team = self._get_or_create_team(entry["team"])
                    if book.team_id == team.id:
                        team = None
                    elif book.team_id is not None:
                        team_conflicts.append(f"{book.title}: has {book.team}, data says {team}")
                        team = None

                if not new_characters and team is None:
                    continue

                changes = [c.name for c in new_characters]
                if team is not None:
                    changes.append(f"team={team.name}")
                self.stdout.write(f"  {book.title}: {', '.join(changes)}")

                book.characters.add(*new_characters)
                if team is not None:
                    book.team = team
                    book.save(update_fields=["team"])
                    teams_set += 1
                books_updated += 1
                links_created += len(new_characters)

            if dry_run:
                transaction.set_rollback(True)

        for title in not_found:
            self.stdout.write(self.style.WARNING(f"  Book not found: {title}"))
        for conflict in team_conflicts:
            self.stdout.write(self.style.WARNING(f"  Team left unchanged - {conflict}"))
        if self.created_characters:
            self.stdout.write(f"\nNew characters: {', '.join(self.created_characters)}")
        if self.created_teams:
            self.stdout.write(f"New teams: {', '.join(self.created_teams)}")

        verb = "Would" if dry_run else "Did"
        self.stdout.write(self.style.SUCCESS(
            f"\nDone ({'dry run, rolled back' if dry_run else 'committed'}). "
            f"Books updated: {books_updated}  Character links: {links_created}  "
            f"Teams set: {teams_set}  {verb} create {len(self.created_characters)} "
            f"characters, {len(self.created_teams)} teams  Not found: {len(not_found)}"
        ))

    def _get_or_create_character(self, name, publisher):
        # Prefer an exact-case match - the DB has a few case-only duplicates
        # (e.g. "Spider-Man" and "Spider-man") and the data file uses the
        # canonical spelling.
        matches = list(Character.objects.filter(name__iexact=name, publisher=publisher))
        for character in matches:
            if character.name == name:
                return character
        if matches:
            return matches[0]
        self.created_characters.append(f"{name} ({publisher.name})")
        return Character.objects.create(name=name, publisher=publisher)

    def _get_or_create_team(self, name):
        team = Team.objects.filter(name__iexact=name).first()
        if team is None:
            self.created_teams.append(name)
            team = Team.objects.create(name=name)
        return team
