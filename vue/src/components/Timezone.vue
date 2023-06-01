<template>
  <div>
    <div>Local Time: {{ localTime }}</div>
    <div>Time Zone: {{ timeZone }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['locations'],
  data() {
    return {
      localTime: '',
      timeZone: '',
    };
  },
  watch: {
    locations: {
      handler: 'getLocalTime',
      deep: true,
    },
  },
  mounted() {
    this.getLocalTime();
  },
  methods: {
    getLocalTime() {
      if (this.locations && this.locations.length > 0) {
        const lastLocation = this.locations[this.locations.length - 1];
        axios
          .get('https://maps.googleapis.com/maps/api/timezone/json', {
            params: {
              location: `${lastLocation.latitude},${lastLocation.longitude}`,
              timestamp: Math.floor(Date.now() / 1000),
              key: 'AIzaSyAZwWrFX929IUJ6fTsY2AuNF3t-Sh0N818',
            },
          })
          .then(response => {
            if (response.data.status === 'OK') {
              const { timeZoneId } = response.data;
              const date = new Date();
              const options = { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit', 
              timeZone: timeZoneId 
              };
              const formatter = new Intl.DateTimeFormat('en-US', options);
              this.localTime = formatter.format(date);
              this.timeZone = response.data.timeZoneName;
            }
          })
          .catch(error => {
            console.error('Error fetching local time and time zone:', error);
          });
      }
    },
  },
};
</script>