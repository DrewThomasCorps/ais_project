import React, {Fragment} from 'react';
import PortMapObject from "../interfaces/PortMapObject";

/**
 * Renders a `Port` component with the given `xPosition` and `yPosition`. The component consists of a `circle` element
 * to represent the port location and a `text` element which contains the port name.
 * @param port
 * @param currentZoom
 * @constructor
 */
const Port = ({ port, currentZoom }: {port: PortMapObject, currentZoom: number}) => {
    const color = '#ffa200CC';
    return (
        <Fragment>
            <circle cx={port.xPosition} cy={port.yPosition} r=".25" strokeWidth="0" stroke={`#ffa20099`} fill={`${color}`}>
            </circle>
            { currentZoom !== 1 ?
                <text x={port.xPosition && port.xPosition + .50}
                      y={port.yPosition && port.yPosition + .24}
                      className="small"
                      stroke-width={`.018`}
                      stroke={`#ffa200`}>
                    {port.port_location}
                 </text>
                : <Fragment />
            }
        </Fragment>
    )
}

export default Port;
