<template>
  <div id="app">
    <Search @searched="updateSearch" @getCurrentLocation="mapCurrentLocation" />
    <Map :latitude="latitude" :longitude="longitude" :locations="locations" />
    <Table :places="locations" @delete="deleteLocations" />
    <Timeze :locations="locations" />
  </div>
</template>

<script>
import Search from './components/Search.vue';
import Map from './components/Map.vue';
import Table from './components/Table.vue';
import Timeze from './components/Timeze.vue';


export default {
  components: {
    Search,
    Map,
    Table,
    Timeze,
  },
  data() {
    return {
      latitude: null,
      longitude: null,
      locations: [],
    };
  },
  methods: {
    updateSearch(location) {
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      this.locations.push({
        name: location.location,
        latitude: location.latitude,
        longitude: location.longitude,
      })

      

    },

    mapCurrentLocation(location) {
      // Update the latitude and longitude data
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      

      // Pass the updated data to the Map component
    },

    deleteLocations(stuff) {
      // Filter out the selected locations and update the array
      this.locations = this.locations.filter(location => !stuff.includes(location.name));
    },
  },
};
</script>
