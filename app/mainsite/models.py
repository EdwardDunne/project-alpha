from django.db import models

class Book(models.Model):
    DC = 'DC'
    MARVEL = 'MA'
    IMAGE = 'IM'
    PUBLISHERS = [
        (DC, 'DC Comics'),
        (MARVEL, 'Marvel'),
        (IMAGE, 'Image'),
    ]
    publisher = models.CharField(
        max_length=2,
        choices=PUBLISHERS,
        default=MARVEL,
    )

    OMNIBUS = 'OM'
    HARDCOVER = 'HA'
    TRADE_PAPERBACK = 'TPB'
    FORMATS = [
        (OMNIBUS, 'Omnibus'),
        (HARDCOVER, 'Hardcover'),
        (TRADE_PAPERBACK, 'Trade Paperback'),
    ]
    format = models.CharField(
        max_length=3,
        choices=FORMATS,
        default=OMNIBUS,
    )

    marvel_id = models.IntegerField(null=True)
    title = models.CharField(max_length=128)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField(null=True)
    thumbnail_url = models.CharField(max_length=256, null=True, blank=True)
    author = models.CharField(max_length=64, null=True, blank=True)
    isbn = models.IntegerField(null=True)