<template>
  <div id="map" style="width: 60%; height: 200px;"></div>
</template>

<script>
import { toRaw } from 'vue';

export default {
  props: ['latitude', 'longitude', 'locations', 'current'],
  data() {
    return {
      markers: [],
      map: null,
    };
  },
  watch: {
    latitude: {
      handler: 'updateMap',
    },
    longitude: {
      handler: 'updateMap',
    },
    locations: {
      handler: 'removeMarker',
    },
  },
  mounted() {
    this.loadGoogleMapsAPI().then(() => {
      this.initMap();
    });
  },
  methods: {
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          // Google Maps API already loaded
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAZwWrFX929IUJ6fTsY2AuNF3t-Sh0N818&libraries=places`;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        }
      });
    },
    initMap() {
      this.map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: 10,
      });
    },
    addMarker() {
      const newMarkerPosition = { lat: this.latitude, lng: this.longitude };

      const isDuplicate = this.markers.some(marker => {
        const markerPosition = marker.getPosition();
        return (
          markerPosition.lat() === newMarkerPosition.lat &&
          markerPosition.lng() === newMarkerPosition.lng
        );
      });

      if (!isDuplicate) {
        const marker = new window.google.maps.Marker({
          position: newMarkerPosition,
          map: this.map,
          title: 'Searched Location',
        });

        if (!this.current) {
          marker.latLng = newMarkerPosition;
          this.markers.push(marker);
        }
      }
    },
    updateMap() {
      if (this.latitude && this.longitude) {
        this.map.setCenter({ lat: this.latitude, lng: this.longitude });
        this.addMarker();
        console.log('Number of markers:', this.markers.length);
      }
    },
    removeMarker() {
      if (this.locations && this.locations.length > 0) {
        const locationsSet = new Set(
          this.locations.map(location => `${location.latitude},${location.longitude}`)
        );

        for (let i = this.markers.length - 1; i >= 0; i--) {
          const marker = this.markers[i];
          const markerLatLng = `${marker.latLng.lat},${marker.latLng.lng}`;

          if (!locationsSet.has(markerLatLng)) {
            toRaw(marker).setMap(null);
            this.markers.splice(i, 1);
          }
        }
      } else {
        this.markers.forEach(marker => toRaw(marker).setMap(null));
        this.markers = [];
      }

      this.$emit('reset-coordinates');
      console.log('After removing, Number of markers:', this.markers.length);
    },
  },
};
</script>