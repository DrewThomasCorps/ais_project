import React, {Fragment} from 'react';
import PortMapObject from "../interfaces/PortMapObject";

const Port = ({ port, currentZoom }: {port: PortMapObject, currentZoom: number}) => {
    const color = '#ffa200CC';

    return (
        <Fragment>
            <circle cx={port.xPosition} cy={port.yPosition} r=".25" strokeWidth="0" stroke={`#ffa20099`} fill={`${color}`}>
            </circle>
            { currentZoom !== 1 ? <text x={port.xPosition && port.xPosition + .50} y={port.yPosition && port.yPosition + .24} className="small" strokeWidth={`.018`} stroke={`#ffa200`}>{port.port_location}</text> : <Fragment />}
        </Fragment>
    )
}

export default Port;
