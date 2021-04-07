import json
import os
import requests
import wget

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

def getOSM(geoJson):
    coords = geoJson['geometry']['coordinates'][0]
    long = [item[0] for item in coords]
    lat = [item[1] for item in coords]
    maxLong = max(long)
    maxLat = max(lat)
    minLong = min(long)
    minLat = min(lat)
    #rectangulo inscrito
    #geoJson['geometry']['coordinates'][0] = [[maxLong,maxLat],[minLong,maxLat],[minLong,minLat],[maxLong,minLat],[maxLong,minLat]]
    #https://api.openstreetmap.org/api/0.6/map?bbox=left,bottom,right,top
    URL= "https://api.openstreetmap.org/api/0.6/map?bbox=%s,%s,%s,%s" % (minLong,minLat,maxLong,maxLat)
    r = requests.get(URL)
    open('src/map.osm','wb').write(r.content)
    return coords

def trimOSM(coords):
    #print(str(coords[0][0])+" "+str(coords[0][1]))
    with open('src/polygone.poly','w') as f:
        f.write("polygone\n")
        for item in coords:
            f.write("\t"+str(item[0])+" "+str(item[1])+"\n")
        f.write('END')
    trim = r"""src\osmconvert.exe src/map.osm -B=src/polygone.poly -o=src/map2.osm"""
    os.system(trim)
    os.remove("src/map.osm")
    os.rename("src/map2.osm", "src/map.osm")
    convert = r"""src\ src/map.osm -B=src/polygone.poly -o=src/map2.osm"""

    pass