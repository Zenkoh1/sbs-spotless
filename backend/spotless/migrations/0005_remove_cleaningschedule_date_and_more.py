# Generated by Django 5.0.4 on 2024-12-10 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotless', '0004_busmodel_bus_cleaningchecklistitem_cleaningschedule_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cleaningschedule',
            name='date',
        ),
        migrations.AddField(
            model_name='cleaningschedule',
            name='datetime',
            field=models.DateTimeField(default='2024-12-10T18:35:27.429373Z'),
            preserve_default=False,
        ),
    ]
