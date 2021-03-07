from django.http.response import HttpResponse
from django.shortcuts import render
from .forms import LocalizacionForm
from .models import Localizacion
from .algoritmo import *
import json

def localizacion_create_view(request):
    form = LocalizacionForm() 
    if request.method == "POST":
        form = LocalizacionForm(request.POST) 
        if form.is_valid():
            #Localizacion.objects.create(**form.cleaned_data) # Permite añadir una tupla a la base de datos de dicha clase.
            variable = Localizacion(**form.cleaned_data)
            #print(sumar(variable.latitud,variable.longitud))  #Cuando usamos un form, este se asigna a un objeto que alamacena los datos obtenidos por el POST, así es como los pasariamos a una funcion externa.
            getSolarData(variable.latitud,variable.longitud)

    context={
        "my_form": form
    }
    return render(request, "localizacion/formPage.html", context)

def carga_tabla(request):
    if request.method == "GET":
        form = LocalizacionForm(request.GET)
        if form.is_valid():
            variable = Localizacion(**form.cleaned_data)
            data = getSolarData(variable.latitud,variable.longitud)

    context={
        "para": data,
        "filas": ['parametros', 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre','Anual'] 
    }
    print(data)
    return render(request, "localizacion/tablePage.html", context)

def mapa(request):
    return render(request, "../templates/mapa.html")

def prueba(request):
    if request.method == "POST":
        data = parse_obj(json.loads(request.body))['Data']
        parsed_data = {}
        for item in data:
            for key in item:
                parsed_data[key]=item[key]
        print(parsed_data)
        return HttpResponse('funciona')
    else:
        return HttpResponse('No es un POST request')

def parse_obj(obj):
    for key in obj:
        if isinstance(obj[key], str):
            obj[key] = obj[key].encode('latin_1').decode('utf-8')
        elif isinstance(obj[key], list):
            obj[key] = list(map(lambda x: x if type(x) != str else x.encode('latin_1').decode('utf-8'), obj[key]))
        pass
    return obj