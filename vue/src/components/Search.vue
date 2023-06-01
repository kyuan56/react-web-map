<template>
  <form @submit.prevent="search">
      <input type="text" v-model="searchInput" placeholder="Enter a location"/>
      <button type="submit">Search</button>
  </form>

  <div>
    <!-- Add the current location button -->
    <button @click="getCurrentLocation">Get Current Location</button>

  </div>
</template>

<script>
import axios from 'axios'; 

export default {
  data() {
    return {
      locationInput: '',
    };
  },
  methods: {
    async search() {
      // Triggered when the search button is clicked or enter key is pressed
      const location = this.searchInput;
      try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
          address: location,
          key: 'api-key', 
      },
        });

        // Extract the latitude and longitude from the API response
        const latitude = response.data.results[0].geometry.location.lat;
        const longitude = response.data.results[0].geometry.location.lng;

        // Update the map component with the searched location
        // Pass the latitude and longitude as props to the map component
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
            // Handle any errors that occur during location acquisition
            console.error('Error getting current location:', error);
          }
        );
      } else {
        // Geolocation is not supported by the browser
        console.error('Geolocation is not supported');
      }
    },
    searchLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log('Current location:', latitude, longitude);
            this.$emit('getCurrentLocation', { latitude, longitude });
          },
          error => {
            // Handle any errors that occur during location acquisition
            console.error('Error getting current location:', error);
          }
        );
      } else {
        // Geolocation is not supported by the browser
        console.error('Geolocation is not supported');
      }
      console.log('Searching for location:', this.locationInput);
    },
  },
};
</script>


<style scoped>

</style>

