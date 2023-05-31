<template>
  <div id="map" style="width:60%; height: 200px;"></div>
</template>

<script>
export default {
  props: ['latitude', 'longitude','locations'],

  data() {
    return {
      markers: [],
      map:null,
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
          script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVbloKI9BQXtE10a4LSSHrBmT24KKZ4XY&libraries=places`;
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
    /*
    addMarker() {
      const marker = new window.google.maps.Marker({
        position: { lat: this.latitude, lng: this.longitude },
        map: this.map,
        title: 'Searched Location',
      });
      this.markers.push(marker);  // Add the new marker to the markers array
      console.log('Number of markers:', this.markers.length);
    },
    */
    addMarker() {
      const newMarkerPosition = { lat: this.latitude, lng: this.longitude };
  
      // Check if the new marker position is already present in the existing markers
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
        this.markers.push(marker);  // Add the new marker to the markers array
      }
      console.log('Number of markers:', this.markers.length);
    },
    updateMap() {
      if (this.latitude && this.longitude) {
        this.map.setCenter({ lat: this.latitude, lng: this.longitude });
        this.addMarker();
      }
    },
    removeMarker() {
     
      if (this.locations && this.locations.length > 0) {
       
        const locationsSet = new Set(this.locations.map(location => location.name));
        for (let i = this.markers.length - 1; i >= 0; i--) {
          const marker = this.markers[i];
          if (!locationsSet.has(marker.getTitle())) {
            marker.setMap(null); // Remove the marker from the map
            this.markers.splice(i, 1); // Remove the marker from the markers array
          }
        }
      } 
      else {
    // Remove all markers from the map and clear the markers array
    
      this.markers.forEach(marker => marker.setMap(null));
      this.markers = [];
      }
    },
  },
};
</script>
