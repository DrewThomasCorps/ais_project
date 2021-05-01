import React, {Fragment} from 'react';
import PortMapObject from "../interfaces/PortMapObject";
import TileData from "../interfaces/TileData";
import MapHelpers from "../MapHelpers";

/**
 *  Renders a `Port` component with the given `xPosition` and `yPosition`. The component consists of a `circle` element
 * to represent the port location and a `text` element which contains the port name displayed at zoom level 3.
 * @param port
 * @param currentZoom
 * @param tile
 * @constructor
 */
const Port = ({ port, currentZoom, tile }: {port: PortMapObject, currentZoom: number, tile: TileData}) => {
    const color = '#ffa200CC';

    /**
     * Dynamically calculates the x position of the port based on the given tile.
     */
    const calculateXPosition = () => {
        return MapHelpers.getXPosition(port["longitude"], tile);
    }

    /**
     * Dynamically calculates the x position of the port based on the given tile.
     */
    const calculateYPosition = () => {
        return MapHelpers.getYPosition(port["latitude"], tile);
    }

    return (
        <Fragment>
            <circle cx={calculateXPosition()} cy={calculateYPosition()} r=".25" strokeWidth="0" stroke={`#ffa20099`} fill={`${color}`}>
            </circle>

            { currentZoom === 3 ?
                <text x={calculateXPosition() + .5}
                      y={calculateYPosition() + .24}
                      className="small"
                      strokeWidth={`.018`}
                      stroke={`#ffa200`}>
                    {port.port_location}
                </text>
                : <Fragment />
            }
        </Fragment>
    )
}

export default Port;
