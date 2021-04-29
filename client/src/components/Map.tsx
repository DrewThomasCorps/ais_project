import React, {Fragment, useEffect, useState} from 'react';
import Vessel from "./Vessel";
import Port from "./Port";
import VesselMapObject from "../interfaces/VesselMapObject";
import Requests from "../Requests";
import PortMapObject from "../interfaces/PortMapObject";
import MapHelpers from "../MapHelpers";
import TileData from "../interfaces/TileData";

/**
 *  * Renders the `Map` component of the GUI by setting the tile image as the background of an `svg` element and rendering
 * vessels and ports based on their x,y positions as a percentage of the 100x100 `viewBox`.
 *
 * @param handleClick
 * @param currentZoom
 * @param tile
 * @constructor
 */
const Map = ({ handleClick, currentZoom, tile }: {currentZoom: number, handleClick: any, tile: TileData}) => {
    const [ports, setPorts] = useState<PortMapObject[]>([]);
    const [vessels, setVessels] = useState<VesselMapObject[]>([
        {
            "Timestamp": {"$date": {"$numberLong": "1605657600000"}},
            "Class": "Class A", "MMSI": 304858000,
            "MsgType": "position_report",
            "Position": {"type": "Point", "coordinates": [55.218332, 13.371672]},
            "Status": "Under way using engine", "SoG": 10.8, "CoG": 94.3, "Heading": 97},
        {
            "Timestamp": {"$date": {"$numberLong": "1605657600000"}},
            "Class": "Class A", "MMSI": 265866000,
            "MsgType": "position_report",
            "Position": {"type": "Point", "coordinates": [54.763183, 12.415067]},
            "Status": "Under way using engine", "RoT": 0.0, "SoG": 14.0, "CoG": 209.7, "Heading": 212},
        {
            "Timestamp": {"$date": {"$numberLong": "1605657600000"}},
            "Class": "Class A", "MMSI": 257961000,
            "MsgType": "position_report",
            "Position": {"type": "Point", "coordinates": [55.00316, 12.809015]},
            "Status": "Under way using engine", "RoT": 0.0, "SoG": 0.2, "CoG": 225.6, "Heading": 240}
    ]);

    /**
     * When the component mounts, the following `useEffect` hook gets port data from the database and runs the `updateVesselPositions` function.
     */
    useEffect(() => {
        getPorts();
        updateVesselPositions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    /**
     * This hook runs the methods that update vessel and port locations based on the current tile data.
     */
    useEffect(() => {
        if (tile !== undefined) {
            mapVessels();
            updatePortLocations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tile]);

    /**
     * Gets vessel positions from AIS messages in database.
     */
    const getVesselPositions = () => {
        console.log('Getting updated vessel positions from AIS message endpoint.');
    }

    /**
     * `mapVessels` enriches each vessel object to include x and y positions based on the current tile's boundaries.
     */
    const mapVessels = () => {
        let newVessels: VesselMapObject[];

        newVessels = vessels.map( vessel => {
            return { ...vessel,
                xPosition: MapHelpers.getXPosition(vessel.Position.coordinates[1], tile),
                yPosition: MapHelpers.getYPosition(vessel.Position.coordinates[0], tile) }});

        setVessels(newVessels);
    }

    /**
     * `updateVesselPositions` gets vessel positions from the database on the interval specified below.
     */
    const updateVesselPositions = ()  => {
        getVesselPositions();
        const interval = setInterval(() => getVesselPositions(), 20000)
        return () => {
            clearInterval(interval);
        }
    }

    /**
     * `getPorts` gets the ports form the database and sets state level `ports` to the response.
     */
    const getPorts = async () => {
        const ports: PortMapObject[] = await Requests.getPorts();
        setPorts(mapPorts(ports));
    }

    /**
     * This function enriches port objects by setting x and y positions relative to the boundaries of a current tile.
     * @param portArray
     */
    const mapPorts = (portArray: PortMapObject[]) => {
        let newPorts: PortMapObject[];

        newPorts = portArray.map( port => {
            return { ...port,
                xPosition: MapHelpers.getXPosition(port["longitude"], tile),
                yPosition: MapHelpers.getYPosition(port["latitude"], tile) }});

        return newPorts;
    }

    /**
     * `updatePortLocations` recalculates x and y positions based on the current tile's boundaries.
     */
    const updatePortLocations = () => {
        let newPorts: PortMapObject[];

        newPorts = ports.map( port => {
            return { ...port,
                xPosition: MapHelpers.getXPosition(port["longitude"], tile),
                yPosition: MapHelpers.getYPosition(port["latitude"], tile) }
        });

        setPorts(newPorts);
    }

    return (
        <Fragment>
            <section className={`map-image-container`} id={`map`} onClick={handleClick}>
                <svg viewBox="0 0 100 100"
                     className="map-image"
                     style={{backgroundImage: `url("${Requests.getBaseUrl()}tile-image/${tile && tile.id}")`,
                         backgroundSize: `cover`}}>
                    { vessels && vessels.map( (vessel) => {return <Vessel xPosition={vessel.xPosition ? vessel.xPosition : 0} yPosition={vessel.yPosition}/>;}) }
                    { ports && ports.map( (port, index) => {return <Port currentZoom={currentZoom} key={index} port={port}/>;}) }
                </svg>
            </section>
        </Fragment>
    )
}

export default Map;
