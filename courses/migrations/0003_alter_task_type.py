# Generated by Django 5.1.6 on 2025-03-28 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0002_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='type',
            field=models.CharField(choices=[('1', 'Missed Word'), ('2', 'Ordering'), ('3', 'Pronunciation'), ('4', 'Audition')], max_length=1),
        ),
    ]
