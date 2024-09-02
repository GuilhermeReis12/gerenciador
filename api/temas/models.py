from django.db import models
from utils.models import TimestampedModel
import json


class Tema(TimestampedModel):
    ds_tema = models.CharField(max_length=250)
    tema = models.TextField(null=True)
    ativo = models.BooleanField(default=False)

    def get_field(self, field):
        if self.tema:
            tema_dict = json.loads(self.tema)
            return tema_dict.get(field)
        return None

    def __str__(self):
        return self.ds_tema
