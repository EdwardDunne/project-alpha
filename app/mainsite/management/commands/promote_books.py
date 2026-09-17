"""
Copies newly-scraped Book rows (and their Author/Artist/Publisher/Format
relations) from the default database into a second, separately-configured
database - e.g. moving books imported locally by import_omnibuses (because
the scraping source blocks the production server's own IP) into production,
without ever scraping from production directly.

Only copies the DB rows. Thumbnail image *files* are not transferred by
this command - see its printed instructions at the end for the follow-up
step needed to get each new book's cover image onto the target
environment's media storage.

Usage:
    # Whole Marvel catalog currently in the default DB, regardless of when
    # it was imported:
    TARGET_SQL_HOST=localhost TARGET_SQL_PORT=15432 \
    TARGET_SQL_DATABASE=djangoec2 TARGET_SQL_USER=webapp \
    TARGET_SQL_PASSWORD=... \
    python manage.py promote_books --publisher marvel --dry-run

    (same env vars, drop --dry-run) python manage.py promote_books --publisher marvel

    # Just books created after a specific local import run:
    python manage.py promote_books --after-id 1677
"""
import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from mainsite.models import Artist, Author, Book, Format, Publisher

TARGET_ALIAS = "target"
REQUIRED_ENV_VARS = (
    "TARGET_SQL_DATABASE",
    "TARGET_SQL_USER",
    "TARGET_SQL_PASSWORD",
    "TARGET_SQL_HOST",
)
PUBLISHER_NAMES = {
    "dc": "DC Comics",
    "marvel": "Marvel Comics",
}
DEFAULT_IMAGE_MANIFEST = "/tmp/promote_books_images.txt"


class Command(BaseCommand):
    help = (
        "Copy Book rows from the default database into a target database "
        "configured via TARGET_SQL_* env vars - by publisher, by id "
        "watermark, or both combined."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--publisher",
            choices=["dc", "marvel", "both"],
            default="both",
            help="Only promote books from this publisher (default: both)",
        )
        parser.add_argument(
            "--after-id",
            type=int,
            default=0,
            help="Only promote books with id greater than this (default: 0, "
            "i.e. no watermark - promote every matching book regardless of "
            "when it was imported locally)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would be created in the target DB without "
            "writing anything. Still connects to the target DB for real, "
            "to check for existing titles - this is what makes the preview "
            "accurate.",
        )
        parser.add_argument(
            "--image-manifest",
            default=DEFAULT_IMAGE_MANIFEST,
            help=f"Where to write the list of local thumbnail paths that "
            f"still need copying onto the target's media storage "
            f"(default: {DEFAULT_IMAGE_MANIFEST}) - one absolute path per "
            "line, ready to feed into a copy loop.",
        )

    def handle(self, *args, **options):
        after_id = options["after_id"]
        publisher_key = options["publisher"]
        self.dry_run = options["dry_run"]
        image_manifest = options["image_manifest"]

        missing = [v for v in REQUIRED_ENV_VARS if not os.environ.get(v)]
        if missing:
            raise CommandError(
                f"Missing required env var(s) for the target DB: {', '.join(missing)}"
            )

        settings.DATABASES[TARGET_ALIAS] = {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ["TARGET_SQL_DATABASE"],
            "USER": os.environ["TARGET_SQL_USER"],
            "PASSWORD": os.environ["TARGET_SQL_PASSWORD"],
            "HOST": os.environ["TARGET_SQL_HOST"],
            "PORT": os.environ.get("TARGET_SQL_PORT", "5432"),
            # A database added to settings.DATABASES at runtime (rather than
            # loaded normally at startup) doesn't go through Django's usual
            # defaulting - these keys are required by the postgres backend
            # even when empty/default.
            "OPTIONS": {},
            "ATOMIC_REQUESTS": False,
            "AUTOCOMMIT": True,
            "CONN_MAX_AGE": 0,
            "CONN_HEALTH_CHECKS": False,
            "TIME_ZONE": None,
            "TEST": {
                "CHARSET": None,
                "COLLATION": None,
                "MIGRATE": True,
                "MIRROR": None,
                "NAME": None,
            },
        }

        new_books = (
            Book.objects.filter(id__gt=after_id)
            .order_by("id")
            .prefetch_related("authors", "artists")
            .select_related("publisher", "format")
        )
        if publisher_key != "both":
            new_books = new_books.filter(publisher__name=PUBLISHER_NAMES[publisher_key])

        total = new_books.count()
        scope = f"{publisher_key} book(s)" if publisher_key != "both" else "book(s)"
        self.stdout.write(f"Found {total} {scope} with id > {after_id}")

        created = 0
        skipped = 0
        image_count = 0

        # Truncate/create fresh at the start, then append one line per image
        # as each book is actually created - not accumulated in memory and
        # written once at the end. A run that dies partway through (e.g. a
        # dropped DB connection) still leaves an accurate manifest of every
        # image needed for the books it *did* manage to create, instead of
        # losing that list entirely. That's not a hypothetical: it's exactly
        # what happened the first time this ran at scale - ~997 books were
        # created with no image ever queued for copying, because the run
        # died before reaching the old end-of-loop write.
        if not self.dry_run:
            open(image_manifest, "w").close()

        for book in new_books:
            if Book.objects.using(TARGET_ALIAS).filter(title=book.title).exists():
                self.stdout.write(f"  Skip (already in target): {book.title}")
                skipped += 1
                continue

            self.stdout.write(
                f"  {'Would create' if self.dry_run else 'Creating'}: {book.title}"
            )
            if self.dry_run:
                created += 1
                continue

            publisher, _ = Publisher.objects.using(TARGET_ALIAS).get_or_create(
                name=book.publisher.name
            )
            fmt, _ = Format.objects.using(TARGET_ALIAS).get_or_create(
                name=book.format.name,
                defaults={"abbreviation": book.format.abbreviation},
            )

            target_book = Book(
                title=book.title,
                description=book.description,
                publisher=publisher,
                format=fmt,
                isbn=book.isbn,
            )

            # Set the stored path directly rather than going through the
            # FileField's storage-backed .save() - that would try to write
            # the physical file onto *this* machine's local disk, which has
            # nothing to do with where the target environment actually
            # serves media from. The real file still has to be copied onto
            # the target's media storage separately (see pending_images
            # below) - this just makes the DB column point at the filename
            # it'll live at once that copy happens.
            if book.thumbnail:
                filename = os.path.basename(book.thumbnail.name)
                target_book.thumbnail.name = f"uploads/book-thumbnails/{filename}"

            target_book.save(using=TARGET_ALIAS)

            for author in book.authors.all():
                target_author, _ = Author.objects.using(TARGET_ALIAS).get_or_create(
                    name=author.name
                )
                target_book.authors.add(target_author)
            for artist in book.artists.all():
                target_artist, _ = Artist.objects.using(TARGET_ALIAS).get_or_create(
                    name=artist.name
                )
                target_book.artists.add(target_artist)

            if book.thumbnail:
                with open(image_manifest, "a") as f:
                    f.write(book.thumbnail.path + "\n")
                image_count += 1

            created += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. {'Would create' if self.dry_run else 'Created'}: {created}  "
            f"Skipped (already exists): {skipped}"
        ))

        if image_count and not self.dry_run:
            self.stdout.write(self.style.WARNING(
                f"\n{image_count} thumbnail file(s) still need to be copied "
                f"onto the target's media storage at uploads/book-thumbnails/ "
                f"for these covers to actually show up - local paths written "
                f"to {image_manifest} (one per line, ready for a copy loop)."
            ))
