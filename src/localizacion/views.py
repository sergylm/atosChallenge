from django.shortcuts import render
from .forms import LocalizacionForm

def localizacion_create_view(request):
    form = LocalizacionForm(request.POST) 
    context={
        "my_form": form
    }
    return render(request, "localizacion/formPage.html", context)
