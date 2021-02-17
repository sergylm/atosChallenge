from django.shortcuts import render
from .forms import LocalizacionForm
from .models import Localizacion

def localizacion_create_view(request):
    form = LocalizacionForm() 
    if request.method == "POST":
        form = LocalizacionForm(request.POST) 
        if form.is_valid():
            Localizacion.objects.create(**form.cleaned_data) 
   
    context={
        "my_form": form
    }
    return render(request, "localizacion/formPage.html", context)
