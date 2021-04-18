"""solarSolutions URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls.conf import re_path
from localizacion import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView

favicon_view = RedirectView.as_view(url='/static/resources/favicon.ico', permanent='True')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('localizacion/', views.localizacion_create_view),
    path('', views.home),
    path('carga_tabla/', views.carga_tabla, name='datos'),
    path('webApp', views.webApp),
    path('nasa', views.solarData),
    path('polygon', views.polygonOSM),
    re_path(r'favicon\.ico$', favicon_view),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)