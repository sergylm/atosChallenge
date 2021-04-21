import os
import requests

def getSolarData(latitud, longitud):
    URL = ("https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?&request=execute&tempAverage=CLIMATOLOGY&identifier=SinglePoint&parameters=SI_EF_TILTED_SURFACE&userCommunity=SB&lon=%s&lat=%s&outputList=CSV&user=DOCUMENTATION" %(longitud,latitud))
    r = requests.get(URL)
    data = r.json()
    parameters = data['features'][0]['properties']['parameter'] #monthly and annual average values by parameter
    parametersInfo = data['parameterInformation'] #full name and parameter units
    for para in parameters:
        parameters[para].insert(0,parametersInfo[para]['longname'])
        parameters[para].insert(1,parametersInfo[para]['units'])
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
    #inscribed rectangle
    #geoJson['geometry']['coordinates'][0] = [[maxLong,maxLat],[minLong,maxLat],[minLong,minLat],[maxLong,minLat],[maxLong,minLat]]
    #https://api.openstreetmap.org/api/0.6/map?bbox=left,bottom,right,top
    URL= "https://api.openstreetmap.org/api/0.6/map?bbox=%s,%s,%s,%s" % (minLong,minLat,maxLong,maxLat)
    r = requests.get(URL)
    open('src/map.osm','wb').write(r.content)
    return coords

def trimOSM(coords):
    with open('src/polygone.poly','w') as f:
        f.write("polygone\n")
        for item in coords:
            f.write("\t"+str(item[0])+" "+str(item[1])+"\n")
        f.write('END')
    trim = r"""src\osmconvert.exe src/map.osm -B=src/polygone.poly -o=src/map2.osm"""
    os.system(trim)
    os.remove("src/map.osm")
    os.rename("src/map2.osm", "src/map.osm")
    convert = r"""src\OSM2World\osm2world.sh -i src/map.osm -o src/prueba.obj"""
    convert2 = r"""src\OSM2World\osm2world.bat -i src/map.osm -o src/prueba.obj"""
    convert3 = r"""java -Xmx512m -jar src/OSM2World/OSM2World.jar -i src/map.osm -o src/static/resources/model3d.obj""" 
    os.system(convert3)
    
    pass