import requests
import wget


def sumar (x,y):
    return(x + y)


def getSolarData(latitud, longitud):
    URL = ("https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?&request=execute&tempAverage=CLIMATOLOGY&identifier=SinglePoint&parameters=SI_EF_TILTED_SURFACE&userCommunity=SB&lon=%s&lat=%s&outputList=CSV&user=DOCUMENTATION" %(longitud,latitud))
    print(URL)
    r = requests.get(URL)
    data = r.json()
    csv = data['outputs']['csv'] #url del csv
    parameters = data['features'][0]['properties']['parameter'] #valores medios mensual y anual por parametro
    parametersInfo = data['parameterInformation'] #nombre completo y unidades de parametros
    """for parameter in parameters:
        print(parameters[parameter])
    for parameter in parametersInfo:
        print(parametersInfo[parameter]['longname'])
        print(parametersInfo[parameter]['units'])"""
    for para in parameters:
        parameters[para].insert(0,parametersInfo[para]['longname'] + "("+ parametersInfo[para]['units'] + ')')
    context={
        "para": parameters,
        "paraInfo": parametersInfo
    }
    """print(parameters)
    for para in parameters:
        for dato in parameters[para]:
            print(dato)"""
    aux = []
    for para in parameters:
        aux.append(parameters[para])
    #wget.download(csv, './prueba.csv') # para descargar el csv
    return aux

def geoCode():
    URL = " https://nominatim.openstreetmap.org/search"
    PARAMS = {"namedetails": 1,
    "polygon_geojson": 1,
    "hierarchy": 1,
    "format": 'json',
    }
    address = "Melchor Fernandez Almagro Madrid"
    params_query="&".join(f"{param_name}={param_value}" for param_name, param_value in PARAMS.items())
    request_url = f"{URL}?q={address}&{params_query}"
    print(request_url)
    r = requests.get(request_url)
    data = r.json()
    print(data)

    """latitude = data['results'][0]['geometry']['location']['lat'] 
    longitude = data['results'][0]['geometry']['location']['lng'] 
    formatted_address = data['results'][0]['formatted_address'] 

    print("Latitud: " + latitude + " Longitud: " + longitude + "\n Dirección: " + formatted_address)
"""
    pass

geoCode()
