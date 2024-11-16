from django.contrib import admin
from .models import Observation, Subregion, Region

# Register your models here.

admin.site.register(Observation)
admin.site.register(Subregion)
admin.site.register(Region)