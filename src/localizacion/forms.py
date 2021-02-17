from django import forms
from .models import Localizacion

class LocalizacionForm(forms.Form):
    latitud  = forms.DecimalField(decimal_places=5, max_digits=10)
    longitud = forms.DecimalField(decimal_places=5, max_digits=10)