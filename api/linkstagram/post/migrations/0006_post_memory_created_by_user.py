# Generated by Django 3.2.11 on 2022-02-03 18:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0006_userprofile_is_dead_profile'),
        ('post', '0005_auto_20220124_1848'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='memory_created_by_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='memories', to='user_profile.userprofile'),
        ),
    ]