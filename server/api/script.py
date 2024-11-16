import random
from datetime import datetime, timedelta
import psycopg2

# Database connection settings (update with your actual credentials)
conn = psycopg2.connect(
    dbname="api",
    user="arianhadi",
    password="postgres",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Constants for dummy data generation
species_choices = ['FD', 'RedD', 'RoeD', 'WB', 'SH', 'W']
gender_choices = ['M', 'F', 'U']
age_choices = ['A', 'M', 'Y', 'U']
health_choices = ['1', '2', '3', '4', '5', 'U']
user_ids = [1]  # Assuming you have 3 users
subregion_ids = [1, 2, 3]  # 5 subregions
base_lat = 54.0
base_lon = 12.0

# Generate 100 dummy entries
observations = []
for _ in range(100):
    specie = random.choice(species_choices)
    gender = random.choice(gender_choices)
    age = random.choice(age_choices)
    health = random.choice(health_choices)
    observe_count = random.randint(1, 20)
    date = datetime.now() - timedelta(days=random.randint(0, 30))  # Random date in last 30 days
    user_id = random.choice(user_ids)
    subregion_id = random.choice(subregion_ids)
    lon = round(base_lon + random.uniform(-2, 2), 6)  # Random longitude within ±2 degrees
    lat = round(base_lat + random.uniform(-2, 2), 6)  # Random latitude within ±2 degrees
    desc = f"Random observation of {specie} in subregion {subregion_id}."
    
    observations.append((
        specie, gender, age, health, observe_count, date, user_id, subregion_id, lon, lat, desc
    ))

# Insert data into the database
insert_query = """
INSERT INTO apiapp_observation (
    specie, gender, age, health, observe_count, date, user_id, subregion_id, lon, lat, description
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

cursor.executemany(insert_query, observations)

# Commit and close the connection
conn.commit()
cursor.close()
conn.close()