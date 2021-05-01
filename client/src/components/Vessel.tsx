import React, {Fragment, useEffect, useState} from 'react';
import VesselMapObject from "../interfaces/VesselMapObject";
import MapHelpers from "../MapHelpers";
import TileData from "../interfaces/TileData";

/**
 *  *  * Renders a `Vessel` component with the given `xPosition` and `yPosition`. A vessel MMSI is rendered at zoom
 *  level 3 or when a vessel is the target of a search.
 * @param vessel
 * @param tile
 * @param mmsi
 * @param zoom
 * @constructor
 */
const Vessel = ({ vessel, tile, mmsi, zoom }: {tile: TileData, vessel: VesselMapObject, mmsi: string, zoom: number}) => {
    const color = '#F2423688';
    const animationDuration = '3.0s';

    /**
     * Dynamically calculates the x position of the vessel based on the given tile.
     */
    const calculateXPosition = () => {
        return MapHelpers.getXPosition(vessel.Position.coordinates[1], tile)
    }

    /**
     * Dynamically calculates the y position of the vessel based on the given tile.
     */
    const calculateYPosition = () => {
        return MapHelpers.getYPosition(vessel.Position.coordinates[0], tile)
    }

    return (
        <Fragment>
            <circle cx={calculateXPosition()} cy={calculateYPosition()} r=".25" strokeWidth="0" stroke={`${color}`} fill={`${color}`}>
                { vessel.MMSI.toString() == mmsi ?
                    <Fragment>
                        <animate attributeType="SVG" attributeName="r" begin="0s" dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to=".5%"/>
                        <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to="3%" />
                        <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="1" to="0"/>
                    </Fragment> : <Fragment/>
                }
            </circle>
            { vessel.MMSI.toString() == mmsi || zoom === 3 ?
                <text x={calculateXPosition() + .50}
                      y={calculateYPosition() + .24}
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
