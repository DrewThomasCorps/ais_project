import React, {useState} from 'react';

import Map from './Map'

const MapContainer = () => {
    const [currentZoom, setCurrentZoom] = useState(1);
    const [zoomMode, setCurrentZoomMode] = useState('in');
    const [currentFocus, setCurrentFocus] = useState({
        longitude: 0,
        latitude: 0,
    })

    const changeZoom = () => {
        if (zoomMode === 'in') {
            zoomIn();
        }
    }

    const zoomIn = () => {
        switch (currentZoom) {
            case 1:
                setCurrentZoom(2);
                break;
            case 2:
                setCurrentZoom(3);
                break;
            case 3:
                setCurrentZoom(1);
                break;
        }
    }

    return (
        <section className={`map-container`}>
            <Map currentZoom={currentZoom} setCurrentZoom={changeZoom}/>
        </section>
    )
}

export default MapContainer;
