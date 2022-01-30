from django.db import models


class ModelHelper(models.Model):

    def safe_get(self, **kwargs):
        try:
            result = self.objects.get(**kwargs)
        except self.DoesNotExist:
            result = None
        return result
