# Generated by Django 5.0.4 on 2024-12-22 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotless_survey', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cleanlinesssurvey',
            name='is_resolved',
            field=models.BooleanField(default=False),
        ),
    ]
