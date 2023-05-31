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
        
        if(this.locations && this.locations.length > 0){
          const lastLocation = this.locations[this.locations.length - 1];
          axios.get('https://maps.googleapis.com/maps/api/timezone/json', {
            params: {
              location: `${lastLocation.latitude},${lastLocation.longitude}`,
              timestamp: Math.floor(Date.now() / 1000),
              key: 'AIzaSyCVbloKI9BQXtE10a4LSSHrBmT24KKZ4XY',
            },
          })
          .then(response => {
              if(response.data.status === 'OK') {
                const { dstOffset, rawOffset } = response.data;
                const localTimestamp = Math.floor(Date.now() / 1000) + dstOffset + rawOffset;
                const date = new Date(localTimestamp * 1000);
                const hours = date.getHours();
                const minutes = "0" + date.getMinutes();
                const seconds = "0" + date.getSeconds();
                const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                this.localTime = formattedTime;
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
  
  <style scoped>

  </style>
  