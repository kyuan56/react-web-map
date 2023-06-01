<template>
  <div id="app">
    <Search @searched="handleSearch" @getCurrentLocation="mapCurrentLocation" />
    <Map :latitude="latitude" :longitude="longitude" :locations="locations" :current="current" @reset-coordinates="resetCoordinates" />
    <Table :places="locations" @delete="removeLocations" />
    <Timezone :locations="locations" />
  </div>
</template>

<script>
import Search from './components/Search.vue';
import Map from './components/Map.vue';
import Table from './components/Table.vue';
import Timezone from './components/Timezone.vue';

export default {
  components: {
    Search,
    Map,
    Table,
    Timezone,
  },
  data() {
    return {
      latitude: null,
      longitude: null,
      locations: [],
      current: false,
    };
  },
  methods: {
    handleSearch(location) {
      this.current = false;
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      this.locations.push({
        name: location.location,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    },
    resetCoordinates() {
      this.latitude = null;
      this.longitude = null;
    },
    mapCurrentLocation(location) {
      this.current = true;
      this.latitude = location.latitude;
      this.longitude = location.longitude;
    },
    removeLocations(stuff) {
      this.locations = this.locations.filter(location => !stuff.includes(location.name));
    },
  },
};
</script>
