from django.http.response import HttpResponse
from django.shortcuts import render
from .algoritmo import get_osm, get_solar_data, trim_osm
import json

def webapp(request):
    return render(request, "../templates/webApp.html")

def home(request):
    return render(request, "../templates/home.html")

def post_analisis(request):
    return render(request, "../templates/postAnalisis.html")

def solar_data(request):
    if request.method == "POST":
        data = parse_obj(json.loads(request.body))['Data']
        parsed_data = {}
        for item in data:
            for key in item:
                parsed_data[key]=item[key]
        print(parsed_data)
        solar_data= get_solar_data(parsed_data['latitude'], parsed_data['longitude'])
        return HttpResponse(json.dumps(solar_data))
    else:
        return HttpResponse('Error')

def polygon_osm(request):
    if request.method == "POST":
        data = parse_obj(json.loads(request.body))['Data']
        coords = get_osm(data)
        trim_osm(coords)
        return HttpResponse(json.dumps(coords))
    else:
        return HttpResponse('Error')

def parse_obj(obj):
    for key in obj:
        if isinstance(obj[key], str):
            obj[key] = obj[key].encode('latin_1').decode('utf-8')
        elif isinstance(obj[key], list):
            obj[key] = list(map(lambda x: x if type(x) != str else x.encode('latin_1').decode('utf-8'), obj[key]))
    return obj