import math
from typing import Tuple, List, Dict, Any


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth in kilometers using the Haversine formula.
    """
    R = 6371.0  # Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance = R * c
    return distance


def get_bounding_box(lat: float, lon: float, distance_km: float) -> Tuple[float, float, float, float]:
    """
    Calculate bounding box coordinates (min_lat, max_lat, min_lon, max_lon)
    for a given point and radius in km.
    """
    lat_change = distance_km / 111.12
    lon_change = distance_km / (111.12 * math.cos(math.radians(lat)))

    min_lat = lat - lat_change
    max_lat = lat + lat_change
    min_lon = lon - lon_change
    max_lon = lon + lon_change

    return min_lat, max_lat, min_lon, max_lon
