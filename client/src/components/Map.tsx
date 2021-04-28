import React, {Fragment} from 'react';
import Vessel from "./Vessel";
import Port from "./Port";
import VesselMapObject from "../interfaces/VesselMapObject";
import Requests from "../Requests";
import PortMapObject from "../interfaces/PortMapObject";

/**
 * Renders the `Map` component of the GUI by setting the tile image as the background of an `svg` element and rendering
 * vessels and ports based on their x,y positions as a percentage of the 100x100 `viewBox`.
 * @param currentImageId
 * @param vessels
 * @param ports
 * @param handleClick
 * @param currentZoom
 * @constructor
 */
const Map = ({ currentImageId, vessels, ports, handleClick, currentZoom }: {currentImageId: number, vessels: VesselMapObject[], ports: PortMapObject[], currentZoom: number, handleClick: any}) => {

    return (
        <Fragment>
            <section className={`map-image-container`} id={`map`} onClick={handleClick}>
                <svg viewBox="0 0 100 100"
                     className="map-image"
                     style={{backgroundImage: `url("${Requests.getBaseUrl()}tile-image/${currentImageId}")`,
                         backgroundSize: `cover`}}>
                    { vessels && vessels.map( (vessel) => {return <Vessel key={vessel.imo} xPosition={vessel.xPosition ? vessel.xPosition : 0} yPosition={vessel.yPosition}/>;}) }
                    { ports && ports.map( (port, index) => {return <Port currentZoom={currentZoom} key={index} port={port}/>;}) }
                </svg>
            </section>
        </Fragment>
    )
}

export default Map;
