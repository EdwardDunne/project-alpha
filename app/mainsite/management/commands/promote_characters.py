"""
Copies newly-imported Character rows (and their Publisher) from the
default database into a second, separately-configured database - the
same TARGET_SQL_* pattern as promote_books, for moving characters
imported locally by import_characters into production.

Usage:
    TARGET_SQL_HOST=localhost TARGET_SQL_PORT=15432 \
    TARGET_SQL_DATABASE=djangoec2 TARGET_SQL_USER=webapp \
    TARGET_SQL_PASSWORD=... \
    python manage.py promote_characters --publisher dc --dry-run

    (same env vars, drop --dry-run) python manage.py promote_characters --publisher dc

    # Just characters created after a specific local import run:
    python manage.py promote_characters --after-id 21
"""
import os

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from mainsite.models import Character, Publisher

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


class Command(BaseCommand):
    help = (
        "Copy Character rows from the default database into a target "
        "database configured via TARGET_SQL_* env vars - by publisher, by "
        "id watermark, or both combined."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--publisher",
            choices=["dc", "marvel", "both"],
            default="both",
            help="Only promote characters from this publisher (default: both)",
        )
        parser.add_argument(
            "--after-id",
            type=int,
            default=0,
            help="Only promote characters with id greater than this (default: 0, "
            "i.e. no watermark - promote every matching character regardless of "
            "when it was imported locally)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would be created in the target DB without "
            "writing anything. Still connects to the target DB for real, "
            "to check for existing characters - this is what makes the "
            "preview accurate.",
        )

    def handle(self, *args, **options):
        after_id = options["after_id"]
        publisher_key = options["publisher"]
        self.dry_run = options["dry_run"]

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

        new_characters = (
            Character.objects.filter(id__gt=after_id)
            .order_by("id")
            .select_related("publisher")
        )
        if publisher_key != "both":
            new_characters = new_characters.filter(
                publisher__name=PUBLISHER_NAMES[publisher_key]
            )

        total = new_characters.count()
        scope = f"{publisher_key} character(s)" if publisher_key != "both" else "character(s)"
        self.stdout.write(f"Found {total} {scope} with id > {after_id}")

        created = 0
        skipped = 0

        for character in new_characters:
            if (
                Character.objects.using(TARGET_ALIAS)
                .filter(name=character.name, publisher__name=character.publisher.name)
                .exists()
            ):
                self.stdout.write(f"  Skip (already in target): {character.name}")
                skipped += 1
                continue

            self.stdout.write(
                f"  {'Would create' if self.dry_run else 'Creating'}: {character.name}"
            )
            if self.dry_run:
                created += 1
                continue

            publisher, _ = Publisher.objects.using(TARGET_ALIAS).get_or_create(
                name=character.publisher.name
            )
            Character.objects.using(TARGET_ALIAS).create(
                name=character.name, publisher=publisher
            )
            created += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. {'Would create' if self.dry_run else 'Created'}: {created}  "
            f"Skipped (already exists): {skipped}"
        ))
