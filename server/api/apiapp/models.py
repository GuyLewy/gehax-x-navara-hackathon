from django.db import models


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
    
    specie = models.CharField(
        max_length=4,
        choices = species_choices,
        default = 'FD'
    )
