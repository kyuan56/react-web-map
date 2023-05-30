import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';

function App() {
  const [markedLocations, setMarkedLocations] = useState([]);

  return (
    <div className="App">
      <Map setMarkedLocations={setMarkedLocations} />
    </div>
  );
}

export default App;
