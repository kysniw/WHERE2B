# Generated by Django 3.2.10 on 2021-12-19 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0004_restaurantphoto'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='city_name',
            field=models.CharField(default='Wrocław', help_text='City name', max_length=500),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='flat_number',
            field=models.CharField(blank=True, help_text='Flat number', max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='postal_code',
            field=models.CharField(default='', help_text='Postal code', max_length=6),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='street_name',
            field=models.CharField(default='', help_text='Street name', max_length=500),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='street_number',
            field=models.CharField(default='', help_text='Street number', max_length=10),
        ),
    ]
