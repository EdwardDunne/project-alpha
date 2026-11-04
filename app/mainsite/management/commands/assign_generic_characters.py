"""
Adds a generic "super character" (e.g. "Green Lantern") to every book that
has one of its specific versions (e.g. "Green Lantern (Hal Jordan)"), so
filtering by the generic name finds every version's books.

Where a bare name already exists it is the generic ("Spider-Man", "Flash",
"Batman") - it's left on its own books as-is and just gains the variants'
books too. Missing generics ("Green Lantern", "Atom") are created.

One-time backfill: nothing adds the generic automatically when a variant is
assigned later, but this is safe to re-run (it only adds missing links).

Usage:
    python manage.py assign_generic_characters --dry-run
    python manage.py assign_generic_characters
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from mainsite.models import Book, Character, Publisher

DC = "DC Comics"
MARVEL = "Marvel Comics"

# (publisher, generic name, variant names, variant name prefixes, team names)
# A book gets the generic if it has any listed variant, any character whose
# name starts with a listed prefix, or one of the listed teams.
FAMILIES = [
    (DC, "Green Lantern", [], ["Green Lantern ("], ["Green Lantern Corps"]),
    (DC, "Flash", ["The Flash (Jay Garrick)"], ["Flash ("], []),
    (DC, "Batman", [], ["Batman ("], []),
    (DC, "Robin", [], ["Robin ("], []),
    (DC, "Batgirl", [], ["Batgirl ("], []),
    (DC, "Batwoman", [], ["Batwoman ("], []),
    (DC, "Atom", [], ["Atom ("], []),
    (DC, "Aqualad", [], ["Aqualad ("], []),
    (DC, "Aquagirl", [], ["Aquagirl ("], []),
    (DC, "Blue Beetle", [], ["Blue Beetle ("], []),
    (DC, "Superboy", [], ["Superboy ("], []),
    (MARVEL, "Spider-Man", ["Spider-Man 2099", "Spider-Man Noir"], ["Spider-Man ("], []),
    (MARVEL, "Ghost Rider", ["Ghost Rider 2099", "Cosmic Ghost Rider"], ["Ghost Rider ("], []),
    (MARVEL, "Wolverine", ["X-23", "Old Man Logan", "Daken"], ["Wolverine ("], []),
    (MARVEL, "Captain America", [], ["Captain America ("], []),
    (MARVEL, "Thor", [], ["Thor ("], []),
    (MARVEL, "Captain Marvel", ["Carol Danvers"], ["Captain Marvel ("], []),
    (MARVEL, "Ms. Marvel", [], ["Ms. Marvel ("], []),
    (MARVEL, "Human Torch", [], ["Human Torch ("], []),
    (MARVEL, "Venom", ["Agent Venom"], ["Venom ("], []),
    (MARVEL, "Carnage", [], ["Carnage ("], []),
]


class Command(BaseCommand):
    help = "Add generic characters (e.g. 'Green Lantern') to books that have one of their specific versions"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change, then roll everything back",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        created = []
        links_created = 0

        with transaction.atomic():
            for publisher_name, generic_name, variant_names, prefixes, team_names in FAMILIES:
                publisher = Publisher.objects.get(name=publisher_name)
                generic = Character.objects.filter(name__iexact=generic_name, publisher=publisher).first()
                if generic is None:
                    generic = Character.objects.create(name=generic_name, publisher=publisher)
                    created.append(f"{generic_name} ({publisher_name})")

                variants = [
                    c for c in Character.objects.filter(publisher=publisher).exclude(id=generic.id)
                    if c.name in variant_names or any(c.name.startswith(p) for p in prefixes)
                ]
                books = (
                    Book.objects.filter(characters__in=variants)
                    | Book.objects.filter(team__name__in=team_names)
                ).exclude(characters=generic).distinct()

                self.stdout.write(
                    f"{generic_name}: variants = {', '.join(c.name for c in variants) or 'none'}"
                )
                for book in books:
                    self.stdout.write(f"  {book.title}")
                    book.characters.add(generic)
                    links_created += 1

            if dry_run:
                transaction.set_rollback(True)

        if created:
            self.stdout.write(f"\nNew characters: {', '.join(created)}")
        self.stdout.write(self.style.SUCCESS(
            f"\nDone ({'dry run, rolled back' if dry_run else 'committed'}). "
            f"Generic links added: {links_created}  Characters created: {len(created)}"
        ))
