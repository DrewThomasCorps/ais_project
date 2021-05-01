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
    const calculatePortXPosition = ():number => {
        return MapHelpers.getXPosition(port["longitude"], tile);
    }

    /**
     * Dynamically calculates the x position of the port based on the given tile.
     */
    const calculatePortYPosition = ():number => {
        return MapHelpers.getYPosition(port["latitude"], tile);
    }

    /**
     * Evaluates that the x position of a port is within the current 100x100 viewbox.
     */
    const evaluatePortXPosition = ():boolean => {
        return MapHelpers.evaluateXPosition(calculatePortXPosition());
    }

    /**
     * Evaluates that the y position of a port is within the current 100x100 viewbox.
     */
    const evaluatePortYPosition = ():boolean => {
        return MapHelpers.evaluateYPosition(calculatePortYPosition());
    }

    /**
     * Renders a port and its name.
     */
    const renderPort = () => {
        return (
            <Fragment>
                { renderPortNode() }
                { currentZoom === 3 ? renderPortName() : <Fragment /> }
            </Fragment>
        )

    }

    /**
     * Renders a port name.
     */
    const renderPortName = () => {
        return (
            <text x={calculatePortXPosition() + .5}
                  y={calculatePortYPosition() + .24}
                  className="small"
                  strokeWidth={`.018`}
                  stroke={`#ffa200`}>
                {port.port_location}
            </text>
        );
    };

    /**
     * Renders a port node.
     */
    const renderPortNode = () => {
        return (
            <circle
                cx={calculatePortXPosition()} cy={calculatePortYPosition()}
                r=".25" strokeWidth="0" stroke={`#ffa20099`} fill={`${color}`}>
        </circle>);
    };

    return (
        <Fragment>
            { evaluatePortXPosition() && evaluatePortYPosition() && renderPort() }
        </Fragment>
    )
}

export default Port;
