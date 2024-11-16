from django.contrib.auth.models import Group, User
from rest_framework import serializers
from .models import Observation, Subregion, Region

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

class SubregionSerializer(serializers.ModelSerializer):
    region = RegionSerializer()
    class Meta:
        model = Subregion
        fields = '__all__'
        depth = 1

class ObserbationSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    subregion = SubregionSerializer()
    class Meta:
        model = Observation
        fields = '__all__'
        depth = 2


