import React, {Fragment, useEffect, useState} from 'react';
import VesselMapObject from "../interfaces/VesselMapObject";

/**
 *  * Renders a `Vessel` component with the given `xPosition` and `yPosition`. A vessel MMSI is rendered at zoom
 *  levels 2 and 3.
 * @param xPosition
 * @param yPosition
 * @param currentZoom
 * @param vessel
 * @param style
 * @constructor
 */
const Vessel = ({ xPosition, yPosition, currentZoom, vessel, style }: {xPosition: number, yPosition: any, currentZoom: number, vessel: VesselMapObject, style: string}) => {
    const [color, setColor] = useState('#F2423688');

    const animationDuration = '3.0s';
    const opacity  = '88';

    /**
     * Renders a vessel in green if the vessel is selected via the search bar
     */
    useEffect(() => {
        if (style === 'selected') {
            setColor('#19b81b' + opacity);
        }
    },[style]);

    return (
        <Fragment>
            <circle cx={xPosition} cy={yPosition} r="1" strokeWidth="0" stroke={`${color}`} fill={`${color}`}>
                <animate attributeType="SVG" attributeName="r" begin="0s" dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to=".5%"/>
                <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to="3%" />
                <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="1" to="0"/>
            </circle>
            { currentZoom !== 1 ?
                <text x={xPosition && xPosition + .50}
                      y={yPosition && yPosition + .24}
                      className="small"
                      strokeWidth={`.018`}
                      stroke={`${color}`}>
                    {`MMSI: ${vessel.MMSI}`}
                </text>
                : <Fragment />
            }
        </Fragment>
    )
}

export default Vessel;
