import React from 'react';
import './scss/styles.scss';

import MapContainer from './components/MapContainer';

/**
 * Renders the `MapContainer` component which contains the state and state handlers for a rendered map.
 */
function App() {
  return (

    <div className="App">
        <MapContainer />
    </div>
  );
}

export default App;
