from django import forms
from .models import Localizacion

class LocalizacionForm(forms.Form):
    latitud  = forms.DecimalField()
    longitud = forms.DecimalField()