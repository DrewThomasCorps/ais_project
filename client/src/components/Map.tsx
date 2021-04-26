import React, {Fragment} from 'react';
import Vessel from "./Vessel";
import Port from "./Port";
import VesselMapObject from "../interfaces/VesselMapObject";
import PortMapObject from "../interfaces/PortMapObject";

const Map = ({ currentImageId, vessels, ports, handleClick, currentZoom }: {currentImageId: number, vessels: VesselMapObject[], ports: PortMapObject[], currentZoom: number, handleClick: any}) => {

    return (
        <Fragment>
            <div className={`map-image-container`} id={`map`} onClick={handleClick}>
                <svg viewBox="0 0 100 100"
                     className="map-image"
                     style={{backgroundImage: `url("http://localhost:3001/tile-image/${currentImageId}")`,
                         backgroundSize: `cover`}}>
                    { vessels && vessels.map( (vessel) => {return <Vessel key={vessel.imo} xPosition={vessel.xPosition ? vessel.xPosition : 0} yPosition={vessel.yPosition}/>;}) }
                    { ports && ports.map( (port, index) => {return <Port currentZoom={currentZoom} key={index} port={port}/>;}) }
                </svg>
            </div>
        </Fragment>
    )
}

export default Map;
