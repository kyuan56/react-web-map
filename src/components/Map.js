// google api key needed
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import Table from './Table';

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [markedLocations, setMarkedLocations] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [map, setMap] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    setMarkedLocations(markedLocations); // Store the markers in the markedLocations state
  }, [markedLocations]);

  const handleCurrentLocation = (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude};
        setCurrentLocation(location);
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  };
  const createMarker = (location) => {
    return new Marker({
      position: location,
      map: map,
    });
  };
  const handleSearchLocation = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: searchLocation,
          key: 'google api key needed',
        },
      });

      const data = response.data;
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const formatted_address = data.results[0].formatted_address;
        const location = { lat,lng,formatted_address};
        const marker = createMarker(location);
        setCurrentLocation(location);
        setMarkedLocations([...markedLocations, { ...location}]);
        const timeZoneResponse = await axios.get('https://maps.googleapis.com/maps/api/timezone/json', {
        params: {
          location: `${lat},${lng}`,
          timestamp: Math.floor(Date.now() / 1000),
          key: 'google api key needed',
        },
      });
      
      const timeZoneData = timeZoneResponse.data;
      if (timeZoneData.status === 'OK') {
        const { timeZoneId } = timeZoneData;
        const localTime = new Date().toLocaleString('en-US', { timeZone: timeZoneId });

        // Set the time zone and local time in the component state
        setTimezone(timeZoneId);
        setLocalTime(localTime);
      } else {
        console.log('Failed to fetch time zone data:', timeZoneData.status);
      }
      } else {
        console.log('No results found for the search location.');
      }
    } catch (error) {
      console.error('Error geocoding search location:', error);
    }

    setSearchLocation('');
  };

  const handleDeleteSelected = () => {
    const updatedLocations = markedLocations.filter((location, index) => !selectedRows.includes(index));
    const updatedMarkers = [];
  
    markedLocations.forEach((location) => {
      console.log("aAA");
      if (location.marker && !selectedRows.includes(location.marker.id)) {
        location.marker.setMap(null); // Remove the marker from the map
        updatedMarkers.push(location.marker);
      }
    });
  
    setMarkedLocations(updatedLocations);
    setMarkers(updatedMarkers);
    setSelectedRows([]);
  };
  
  
  

  

  return (
    <div>
      <p>Time Zone: {timezone}</p>
      <p>Local Time: {localTime}</p>
      <button onClick={handleCurrentLocation}>Get Current Location</button>
      <form onSubmit={handleSearchLocation}>
        <input
          type="text"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>
      <LoadScript googleMapsApiKey="google api key needed">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={currentLocation}
          zoom={10}
          onLoad={(map) => {
            setMap(map);
          }}
        >
          {currentLocation && <Marker position={currentLocation} />}
          {markers.map((marker, index) => (
          <Marker key={index} position={marker.getPosition()} />
        ))}
        </GoogleMap>
      </LoadScript>
      <Table markedLocations={markedLocations} setMarkedLocations={setMarkedLocations} handleDeleteSelected={handleDeleteSelected} selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
    </div>
  );
};

export default Map;
