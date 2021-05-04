import React, {Fragment, useEffect, useState} from 'react';
import Vessel from "./Vessel";
import Port from "./Port";
import VesselMapObject from "../interfaces/VesselMapObject";
import Requests from "../Requests";
import PortMapObject from "../interfaces/PortMapObject";
import TileData from "../interfaces/TileData";

/**
 *  * Renders the `Map` component of the GUI by setting the tile image as the background of an `svg` element and rendering
 * vessels and ports based on their x,y positions as a percentage of the 100x100 `viewBox`.
 *
 * @param handleClick
 * @param currentZoom
 * @param tile
 * @param mmsi
 * @constructor
 */
const Map = ({ handleClick, currentZoom, tile, mmsi }: {currentZoom: number, handleClick: any, tile: TileData, mmsi: string}) => {
    const [ports, setPorts] = useState<PortMapObject[]>([]);
    const [vessels, setVessels] = useState<VesselMapObject[]>([]);

    /**
     * When the component mounts, the following `useEffect` hook gets port data from the database and runs the `updateVesselPositions` function.
     */
    useEffect(() => {
        getPorts();
        return updateVesselPositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    /**
     * Gets vessel positions from AIS messages in database.
     */
    const getVesselPositions = async () => {
        const vessels: VesselMapObject[] = await Requests.getRecentVesselPositions();
        await setVessels(vessels);
    }

    /**
     * `updateVesselPositions` gets vessel positions from the database on the interval specified below.
     */
    const updateVesselPositions = ()  => {
        getVesselPositions();

        const interval = setInterval(() => getVesselPositions(), 5000);

        return () => {
            clearInterval(interval);
        }
    }

    /**
     * `getPorts` gets the ports form the database and sets state level `ports` to the response.
     */
    const getPorts = async () => {
        const ports: PortMapObject[] = await Requests.getPorts();
        setPorts(ports);
    }

    return (
        <Fragment>
            <section className={`map-image-container`} id={`map`} onClick={handleClick}>
                <svg viewBox="0 0 100 100"
                     className="map-image"
                     style={{backgroundImage: `url("${Requests.getBaseUrl()}tile-image/${tile && tile.id}")`,
                         backgroundSize: `cover`}}>
                    { vessels && vessels.map( (vessel) => {
                        return <Vessel key={vessel.MMSI}
                                       tile={tile}
                                       vessel={vessel}
                                       mmsi={mmsi}
                                       zoom={currentZoom}
                        />;

                    }) }
                    { ports && ports.map( (port, index) => {
                        return <Port currentZoom={currentZoom} key={index} tile={tile} port={port}/>;
                    }) }
                </svg>
            </section>
        </Fragment>
    )
}

export default Map;
