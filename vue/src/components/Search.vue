<template>
  <form @submit.prevent="search">
    <input type="text" v-model="searchInput" placeholder="Enter a location" />
    <button type="submit">Search</button>
  </form>

  <div>
    <button @click="getCurrentLocation">Get Current Location</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchInput: '',
    };
  },
  methods: {
    async search() {
      const location = this.searchInput;
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: location,
            key: 'AIzaSyAZwWrFX929IUJ6fTsY2AuNF3t-Sh0N818',
          },
        });
        const latitude = response.data.results[0].geometry.location.lat;
        const longitude = response.data.results[0].geometry.location.lng;
        this.$emit('searched', { latitude, longitude, location });
      } catch (error) {
        console.error('Error during location search:', error);
      }
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Current location:', latitude, longitude);
            this.$emit('getCurrentLocation', { latitude, longitude });
          },
          error => {
            console.error('Error getting current location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported');
      }
    },
  },
};
</script>