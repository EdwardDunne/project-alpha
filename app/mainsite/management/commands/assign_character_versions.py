"""
Adds specific versions of legacy characters ("Flash (Barry Allen)",
"Flash (Wally West)", "Spider-Man (Peter Parker)", ...) alongside the
generic ones from assign_generic_characters, and assigns each version to
the books it headlines.

A version is assigned either by title (`titles` - case-insensitive
substrings) or to every book that has the generic character except a few
(`all_with` + `except_titles`), for versions that cover nearly all of a
generic's books (most "Spider-Man" books are Peter Parker).

Run assign_generic_characters afterwards so any book that only got a
version also gets its generic. Keyed by name/title so it can run on prod.

Usage:
    python manage.py assign_character_versions --dry-run
    python manage.py assign_character_versions
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from mainsite.models import Book, Character, Publisher

DC = "DC Comics"
MARVEL = "Marvel Comics"

# (publisher, current name, new name) - existing rows that are really a
# specific version, or have broken names from the import
RENAMES = [
    (DC, "Wally West", "Flash (Wally West)"),
    (DC, "Hawkgirl (Shiera Hall)]]", "Hawkgirl (Shiera Hall)"),
    (DC, "Hawkwoman]]", "Hawkwoman"),
    (MARVEL, "Peter Parker", "Spider-Man (Peter Parker)"),
    (MARVEL, "Sam Wilson", "Captain America (Sam Wilson)"),
]

VERSIONS = [
    # DC
    dict(publisher=DC, name="Flash (Barry Allen)",
         titles=["Flash (2011)", "Flash (2016)", "Flash The Silver Age", "Flashpoint"]),
    dict(publisher=DC, name="Flash (Wally West)",
         titles=["Flash By Geoff Johns", "Flash By Mark Waid", "Flash By William Messner-Loebs"]),
    dict(publisher=DC, name="Batman (Bruce Wayne)",
         all_with="Batman", except_titles=["Batman And Robin By Grant Morrison"]),
    dict(publisher=DC, name="Batman (Dick Grayson)",
         titles=["Batman And Robin By Grant Morrison"]),
    dict(publisher=DC, name="Batman (Jean-Paul Valley)",
         titles=["Knightfall Omnibus Vol. 2", "Knightfall Omnibus Vol. 3"]),
    dict(publisher=DC, name="Robin (Dick Grayson)",
         titles=["Robin The Bronze Age", "All-Star Batman And Robin"]),
    dict(publisher=DC, name="Robin (Jason Todd)", titles=[]),
    dict(publisher=DC, name="Robin (Tim Drake)", titles=[]),
    dict(publisher=DC, name="Robin (Damian Wayne)",
         titles=["Batman And Robin (2011)", "Batman And Robin By Grant Morrison", "Batman And Son"]),
    dict(publisher=DC, name="Robin (Stephanie Brown)", titles=[]),
    dict(publisher=DC, name="Batgirl (Barbara Gordon)",
         all_with="Batgirl", except_titles=[]),
    dict(publisher=DC, name="Batwoman (Kate Kane)", titles=["Batwoman Omnibus"]),
    dict(publisher=DC, name="Green Lantern (Guy Gardner)",
         titles=["Green Lantern Corps By Peter J Tomasi"]),
    dict(publisher=DC, name="Blue Beetle (Ted Kord)", titles=[]),
    dict(publisher=DC, name="Blue Beetle (Dan Garrett)", titles=[]),
    # Marvel
    dict(publisher=MARVEL, name="Spider-Man (Peter Parker)",
         all_with="Spider-Man",
         except_titles=["Miles Morales", "Spider-Man 2099", "Spider-Man Ben Reilly", "Superior Spider-Man Omnibus"]),
    dict(publisher=MARVEL, name="Spider-Man (Ben Reilly)", titles=["Spider-Man Ben Reilly"]),
    dict(publisher=MARVEL, name="Ghost Rider (Johnny Blaze)",
         titles=["Ghost Rider (2022)", "Ghost Rider By Jason Aaron"]),
    dict(publisher=MARVEL, name="Ghost Rider (Danny Ketch)",
         titles=["Ghost Rider Danny Ketch", "Ghost Rider By Jason Aaron"]),
    dict(publisher=MARVEL, name="Ghost Rider (Robbie Reyes)", titles=[]),
    dict(publisher=MARVEL, name="Wolverine (Logan)",
         all_with="Wolverine", except_titles=["All-New Wolverine", "Daken", "X-23", "Old Man Logan"]),
    dict(publisher=MARVEL, name="Captain America (Steve Rogers)",
         all_with="Captain America", except_titles=[]),
    dict(publisher=MARVEL, name="Captain America (Bucky Barnes)",
         titles=["The Death Of Captain America", "Captain America Lives", "The Trial Of Captain America"]),
    dict(publisher=MARVEL, name="Captain America (Sam Wilson)",
         titles=["Captain America By Nick Spencer"]),
    dict(publisher=MARVEL, name="Captain Marvel (Mar-Vell)",
         titles=["Captain Mar-Vell Omnibus", "The Death Of Captain Marvel"]),
    dict(publisher=MARVEL, name="Thor (Odinson)",
         all_with="Thor", except_titles=["Thor By Jason Aaron Omnibus Vol. 2"]),
    dict(publisher=MARVEL, name="Thor (Jane Foster)",
         titles=["Thor By Jason Aaron Omnibus Vol. 2"]),
]


def _matches(title, patterns):
    return any(p.lower() in title.lower() for p in patterns)


class Command(BaseCommand):
    help = "Create specific versions of legacy characters (e.g. 'Flash (Barry Allen)') and assign them to their books"

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
            publishers = {p.name: p for p in Publisher.objects.all()}

            self.stdout.write("Renames:")
            for publisher_name, old_name, new_name in RENAMES:
                updated = Character.objects.filter(
                    name=old_name, publisher=publishers[publisher_name]
                ).update(name=new_name)
                if updated:
                    self.stdout.write(f"  {old_name} -> {new_name}")

            for version in VERSIONS:
                publisher = publishers[version["publisher"]]
                character, was_created = Character.objects.get_or_create(
                    name=version["name"], publisher=publisher
                )
                if was_created:
                    created.append(version["name"])

                if "all_with" in version:
                    books = Book.objects.filter(
                        characters__name=version["all_with"], characters__publisher=publisher
                    )
                    books = [b for b in books if not _matches(b.title, version["except_titles"])]
                else:
                    books = (
                        [b for b in Book.objects.filter(publisher=publisher) if _matches(b.title, version["titles"])]
                        if version["titles"] else []
                    )
                books = [b for b in books if not b.characters.filter(id=character.id).exists()]

                self.stdout.write(f"\n{version['name']}: {len(books)} book(s)")
                for book in books:
                    self.stdout.write(f"  {book.title}")
                    book.characters.add(character)
                    links_created += 1

            if dry_run:
                transaction.set_rollback(True)

        if created:
            self.stdout.write(f"\nNew characters: {', '.join(created)}")
        self.stdout.write(self.style.SUCCESS(
            f"\nDone ({'dry run, rolled back' if dry_run else 'committed'}). "
            f"Version links added: {links_created}  Characters created: {len(created)}"
        ))
