import requests
import wget

def sumar (x,y):
    return(x + y)


def getSolarData(latitud, longitud):
    URL = ("https://power.larc.nasa.gov/cgi-bin/v1/DataAccess.py?&request=execute&tempAverage=CLIMATOLOGY&identifier=SinglePoint&parameters=SI_EF_TILTED_SURFACE&userCommunity=SB&lon=%s&lat=%s&outputList=CSV&user=DOCUMENTATION" %(longitud,latitud))
    print(URL)
    r = requests.get(URL)
    data = r.json()
    csv = data['outputs']['csv']
    wget.download(csv, './prueba.csv')
    return 0