

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='fda_notice',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
    ]
