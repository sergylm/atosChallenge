from django.db import models

class Localizacion(models.Model):
    latitud  = models.DecimalField(decimal_places=5, max_digits=10)
    longitud = models.DecimalField(decimal_places=5, max_digits=10)
