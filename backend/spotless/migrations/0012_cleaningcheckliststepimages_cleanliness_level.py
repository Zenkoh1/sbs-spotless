# Generated by Django 5.0.4 on 2024-12-20 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotless', '0011_alter_cleaningcheckliststepimages_cleaning_checklist_step'),
    ]

    operations = [
        migrations.AddField(
            model_name='cleaningcheckliststepimages',
            name='cleanliness_level',
            field=models.IntegerField(default='1'),
            preserve_default=False,
        ),
    ]