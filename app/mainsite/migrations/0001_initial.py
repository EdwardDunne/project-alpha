# Generated by Django 4.1 on 2022-09-15 21:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Omnibus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('publisher', models.CharField(choices=[('DC', 'DC Comics'), ('MA', 'Marvel'), ('IM', 'Image')], default='MA', max_length=2)),
            ],
        ),
    ]
