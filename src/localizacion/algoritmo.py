import json
import requests
import wget

def sumar (x,y):
    return(x + y)


def getSolarData(latitud, longitud):
    URL = ("https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?&request=execute&tempAverage=CLIMATOLOGY&identifier=SinglePoint&parameters=SI_EF_TILTED_SURFACE&userCommunity=SB&lon=%s&lat=%s&outputList=CSV&user=DOCUMENTATION" %(longitud,latitud))
    r = requests.get(URL)
    data = r.json()
    # with open('data.json','w') as json_file:
    #     json.dump(data,json_file)
    #csv = data['outputs']['csv'] #url del csv
    #wget.download(csv, './prueba.csv') # para descargar el csv
    parameters = data['features'][0]['properties']['parameter'] #valores medios mensual y anual por parametro
    parametersInfo = data['parameterInformation'] #nombre completo y unidades de parametros
    for para in parameters:
        parameters[para].insert(0,parametersInfo[para]['longname'] + "("+ parametersInfo[para]['units'] + ')')
    aux = []
    for para in parameters:
        aux.append(parameters[para])
    return aux

def getRectangle(geoJson):
    coords = geoJson['geometry']['coordinates'][0]
    long = [item[0] for item in coords]
    lat = [item[1] for item in coords]
    maxLong = max(long)
    maxLat = max(lat)
    minLong = min(long)
    minLat = min(lat)
    geoJson['geometry']['coordinates'][0] = [[maxLong,maxLat],[minLong,maxLat],[minLong,minLat],[maxLong,minLat],[maxLong,minLat]]
    return geoJson