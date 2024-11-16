
from django.shortcuts import render
from django.http import HttpResponse
from io import BytesIO
import matplotlib.pyplot as plt
from matplotlib.ticker import MaxNLocator
from .models import Observation, Subregion
import geopandas as gpd
from shapely.geometry import Point
import pandas as pd
from shapely.wkt import loads
from .serializares import ObserbationSerializer


# Create your views here.


from shapely.wkt import loads

def prepare_geospatial_data():
    # Fetch observations with related subregion data
    observations = Observation.objects.all()
    serializer = ObserbationSerializer(observations,many=True)
    # Convert to DataFrame
    print(serializer.data)
    observations_df = pd.DataFrame(serializer.data)

    print(observations_df.iloc[0])
    
    # Create geometry for observations
    obs_geometry = [Point(xy) for xy in zip(observations_df['lon'], observations_df['lat'])]
    observations_gdf = gpd.GeoDataFrame(observations_df, geometry=obs_geometry, crs="EPSG:4326")
    
    # Create GeoDataFrame for subregions, correctly handling polygon geometry
    subregions_df = observations_df[['subregion__name', 'subregion__poly']].drop_duplicates()
    subregions_df['geometry'] = subregions_df['subregion__poly'].apply(loads)  # Convert poly WKT to Shapely geometry
    subregions_gdf = gpd.GeoDataFrame(subregions_df, geometry='geometry', crs="EPSG:4326")
    
    return observations_gdf, subregions_gdf



def plot_observations_and_subregions(request):
    observations = Observation.objects.all()
    serializer = ObserbationSerializer(observations,many=True)

    return HttpResponse(serializer.data)
    observations_gdf, subregions_gdf = prepare_geospatial_data()
    
    # Plot subregions and observations
    fig, ax = plt.subplots(figsize=(12, 8))
    subregions_gdf.plot(ax=ax, color='lightblue', edgecolor='black', label='Subregions')
    observations_gdf.plot(ax=ax, color='red', markersize=5, label='Observations')
    plt.title("Observations and Subregions")
    plt.legend()
    
    # Serve the plot as an HTTP response
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    plt.close(fig)
    buffer.seek(0)
    return HttpResponse(buffer, content_type='image/png')


def plot_species_distribution(request):
    observations_gdf, subregions_gdf = prepare_geospatial_data()
    
    # Group by subregion and species to count occurrences
    species_counts = observations_gdf.groupby(['subregion__name', 'specie']).size().reset_index(name='species_count')
    
    # Merge counts with subregion GeoDataFrame
    subregions_counts = subregions_gdf.merge(species_counts, left_on='subregion__name', right_on='subregion__name', how='left')
    subregions_counts['species_count'] = subregions_counts['species_count'].fillna(0)
    
    # Plot subregions colored by species count
    fig, ax = plt.subplots(figsize=(12, 8))
    subregions_counts.plot(
        column='species_count',
        cmap='OrRd',
        legend=True,
        edgecolor='black',
        ax=ax
    )
    plt.title("Species Count per Subregion")
    
    # Serve the plot as an HTTP response
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    plt.close(fig)
    buffer.seek(0)
    return HttpResponse(buffer, content_type='image/png')
