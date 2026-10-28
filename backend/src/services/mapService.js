const axios = require('axios');
const { calculateDistanceKm, estimateTravelTimeMinutes } = require('../utils/distance');

class MapService {
  /**
   * Calculates distance between two coordinates in km and estimated transit duration
   */
  static async getDistanceAndETA({ originLat, originLon, destLat, destLon, vehicleType = 'Eco EV Scooter' }) {
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

    // If Google Maps API key is configured, use Distance Matrix API
    if (googleApiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLon}&destinations=${destLat},${destLon}&key=${googleApiKey}`;
        const resp = await axios.get(url, { timeout: 4000 });
        const element = resp.data?.rows?.[0]?.elements?.[0];

        if (element && element.status === 'OK') {
          return {
            distanceKm: Math.round((element.distance.value / 1000) * 100) / 100,
            durationMinutes: Math.ceil(element.duration.value / 60),
            source: 'Google Maps'
          };
        }
      } catch (err) {
        console.warn('[MapService] Google Maps API error, falling back to Haversine:', err.message);
      }
    }

    // Default fast Haversine spherical computation
    const distanceKm = calculateDistanceKm(originLat, originLon, destLat, destLon);
    const durationMinutes = estimateTravelTimeMinutes(distanceKm, vehicleType);

    return {
      distanceKm,
      durationMinutes,
      source: 'Haversine Engine'
    };
  }

  /**
   * Geocodes an address into latitude and longitude
   */
  static async geocodeAddress(address) {
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

    if (mapboxToken) {
      try {
        const encoded = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${mapboxToken}&limit=1`;
        const resp = await axios.get(url, { timeout: 4000 });
        const feature = resp.data?.features?.[0];

        if (feature && feature.center) {
          return {
            longitude: feature.center[0],
            latitude: feature.center[1],
            formattedAddress: feature.place_name
          };
        }
      } catch (err) {
        console.warn('[MapService] Mapbox geocoding error:', err.message);
      }
    }

    // Fallback baseline coordinates (e.g. New Delhi / Metropolitan area)
    return {
      latitude: 28.6139,
      longitude: 77.209,
      formattedAddress: address
    };
  }
}

module.exports = MapService;
