import os
import requests

def get_solar_data(latitud, longitud):
    URL = ("https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?&request=execute&tempAverage=CLIMATOLOGY&identifier=SinglePoint&parameters=SI_EF_TILTED_SURFACE&userCommunity=SB&lon=%s&lat=%s&outputList=CSV&user=DOCUMENTATION" %(longitud,latitud))
    r = requests.get(URL)
    data = r.json()
    parameters = data['features'][0]['properties']['parameter'] #monthly and annual average values by parameter
    parameters_info = data['parameterInformation'] #full name and parameter units
    for para in parameters:
        parameters[para].insert(0,parameters_info[para]['longname'])
        parameters[para].insert(1,parameters_info[para]['units'])
    aux = []
    for para in parameters:
        aux.append(parameters[para])
    return aux

def get_osm(geo_json):
    coords = geo_json['geometry']['coordinates'][0]
    long = [item[0] for item in coords]
    lat = [item[1] for item in coords]
    max_long = max(long)
    max_lat = max(lat)
    min_long = min(long)
    min_lat = min(lat)
    #inscribed rectangle
    #geoJson['geometry']['coordinates'][0] = [[max_long,max_lat],[min_long,max_lat],[min_long,min_lat],[max_Long,min_lat],[max_long,min_lat]]
    #https://api.openstreetmap.org/api/0.6/map?bbox=left,bottom,right,top
    URL= "https://api.openstreetmap.org/api/0.6/map?bbox=%s,%s,%s,%s" % (min_long,min_lat,max_long,max_lat)
    r = requests.get(URL)
    open('src/map.osm','wb').write(r.content)
    return coords

def trim_osm(coords):
    with open('src/polygone.poly','w') as f:
        f.write("polygone\n")
        for item in coords:
            f.write("\t"+str(item[0])+" "+str(item[1])+"\n")
        f.write('END')
    trim = r"""src/osmconvert src/map.osm -B=src/polygone.poly -o=src/map2.osm"""
    os.system(trim)
    os.remove("src/map.osm")
    os.rename("src/map2.osm", "src/map.osm")
    convert3 = r"""java -Xmx512m -jar src/OSM2World/OSM2World.jar -i src/map.osm -o src/static/resources/model3d.obj""" 
    os.system(convert3)
