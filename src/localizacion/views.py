from django.http.response import HttpResponse
from django.shortcuts import render
from .algoritmo import *
import json
from django.views.decorators.csrf import csrf_protect

def webApp(request):
    return render(request, "../templates/webApp.html")

def home(request):
    return render(request, "../templates/home.html")

def posAnalisis(request):
    return render(request, "../templates/postAnalisis.html")

def solarData(request):
    if request.method == "POST":
        data = parse_obj(json.loads(request.body))['Data']
        parsed_data = {}
        for item in data:
            for key in item:
                parsed_data[key]=item[key]
        print(parsed_data)
        solarData= getSolarData(parsed_data['latitude'], parsed_data['longitude'])
        return HttpResponse(json.dumps(solarData))
    else:
        return HttpResponse('Error')

def polygonOSM(request):
    if request.method == "POST":
        data = parse_obj(json.loads(request.body))['Data']
        #print(data)
        coords = getOSM(data)
        trimOSM(coords)
        return HttpResponse(json.dumps(coords))
    else:
        return HttpResponse('Error')

def parse_obj(obj):
    for key in obj:
        if isinstance(obj[key], str):
            obj[key] = obj[key].encode('latin_1').decode('utf-8')
        elif isinstance(obj[key], list):
            obj[key] = list(map(lambda x: x if type(x) != str else x.encode('latin_1').decode('utf-8'), obj[key]))
        pass
    return obj