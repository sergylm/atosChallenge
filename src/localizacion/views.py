from django.http.response import HttpResponse
from django.shortcuts import render
from .algoritmo import get_osm, get_solar_data, trim_osm
from django.views.decorators.http import require_GET, require_POST
import json

@require_GET
def webapp(request):
    return render(request, "../templates/webApp.html")

@require_GET
def home(request):
    return render(request, "../templates/home.html")

@require_GET
def post_analisis(request):
    return render(request, "../templates/postAnalisis.html")

@require_POST
def solar_data(request):
    data = parse_obj(json.loads(request.body))['Data']
    parsed_data = {}
    for item in data:
        for key in item:
            parsed_data[key]=item[key]
    print(parsed_data)
    solar_data= get_solar_data(parsed_data['latitude'], parsed_data['longitude'])
    return HttpResponse(json.dumps(solar_data))

@require_POST
def polygon_osm(request):
    data = parse_obj(json.loads(request.body))['Data']
    coords = get_osm(data)
    trim_osm(coords)
    return HttpResponse(json.dumps(coords))

def parse_obj(obj):
    for key in obj:
        if isinstance(obj[key], str):
            obj[key] = obj[key].encode('latin_1').decode('utf-8')
        elif isinstance(obj[key], list):
            obj[key] = list(map(lambda x: x if type(x) != str else x.encode('latin_1').decode('utf-8'), obj[key]))
    return obj