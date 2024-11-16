from django.contrib.gis.db import models 
from django.contrib.auth.models import User


class Observation(models.Model):
    species_choices = [
        ('FD','Fallow deer'),
        ('RedD','Red deer'),
        ('RoeD','Roe deer'),
        ('WB','Wild boar'),
        ('SH','Scottish Highlander'),
        ('W','Wolf')
    ]
    gender_choices = [
        ('M','Male'),
        ('F','Female'),
        ('U','Unknown')
    ]
    age_choices = [
        ('A','Adult'),
        ('M','Mature'),
        ('Y','Young'),
        ('U','Unknown')
    ]
    health_choices = [
        ('1','One'),
        ('2','Two'),
        ('3','Three'),
        ('4','Four'),
        ('5','Five'),
        ('U','Unknown')
    ]
    specie = models.CharField(
        max_length=4,
        choices = species_choices,
        default = 'FD'
    )
    gender = models.CharField(
        max_length=1,
        choices = gender_choices,
        default = 'M'
    )
    age = models.CharField(
        max_length=1,
        choices = age_choices,
        default = 'A'
    )
    health = models.CharField(
        max_length=1,
        choices = health_choices,
        default = '1'
    )
    observe_count = models.IntegerField()
    date = models.DateTimeField()
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    subregion = models.ForeignKey('Subregion', on_delete=models.CASCADE)
    lon = models.FloatField()
    lat = models.FloatField()
    description = models.TextField()

    def __str__(self):
        return self.specie + self.gender + self.date.__str__()
    

class Region(models.Model):
    region = models.IntegerField('Region Code')
    name = models.CharField(max_length=50)
    poly = models.PolygonField()
    def __str__(self):
        return self.name
    

class Subregion(models.Model):
    region = models.ForeignKey('Region', on_delete=models.CASCADE)
    subregion = models.IntegerField('Subregion Code')
    name = models.CharField(max_length=50)
    poly = models.PolygonField()
    def __str__(self):
        return self.name

