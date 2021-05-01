import React, {Fragment} from 'react';
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
    const calculateVesselXPosition = ():number => {
        return MapHelpers.getXPosition(vessel.Position.coordinates[1], tile)
    }

    /**
     * Dynamically calculates the y position of the vessel based on the given tile.
     */
    const calculateVesselYPosition = ():number => {
        return MapHelpers.getYPosition(vessel.Position.coordinates[0], tile)
    }

    /**
     * Evaluates that the x position of a vessel is within the current 100x100 viewbox.
     */
    const evaluateVesselXPosition = ():boolean => {
        return MapHelpers.evaluateXPosition(calculateVesselXPosition());
    }

    /**
     * Evaluates that the y position of a vessel is within the current 100x100 viewbox.
     */
    const evaluateVesselYPosition = ():boolean => {
        return MapHelpers.evaluateYPosition(calculateVesselYPosition());
    }

    /**
     * Dynamically renders a vessel node, its animation, and its MMSI depending on the zoom level and current MMSI selection.
     */
    const renderVessel = () => {
        return (
            <Fragment>
                <circle cx={calculateVesselXPosition()} cy={calculateVesselYPosition()} r=".25"
                        strokeWidth="0" stroke={`${color}`} fill={`${color}`}>
                    { vessel.MMSI.toString() === mmsi || zoom === 3 ? renderVesselAnimation() : <Fragment/> }
                </circle>
                { vessel.MMSI.toString() === mmsi || zoom === 3 ? renderVesselMMSIs() : <Fragment /> }
            </Fragment>
        );
    }

    /**
     * Dynamically renders a vessel animation depending on current MMSI selection and zoom level.
     */
    const renderVesselAnimation = () => {
        return (
            <Fragment>
                <animate attributeType="SVG" attributeName="r" begin="0s" dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to=".5%"/>
                <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to="3%" />
                <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="1" to="0"/>
            </Fragment>
        );
    }

    /**
     * Dynamically renders vessel MMSI depending on current zoom level and MMSI selection.
     */
    const renderVesselMMSIs = () => {
        return (
            <text x={calculateVesselXPosition() + .50}
                  y={calculateVesselYPosition() + .24}
                  className="small"
                  strokeWidth={`.018`}
                  stroke={`${color}`}>
                {`MMSI: ${vessel.MMSI}`}
            </text>
        );
    }

    return (
        <Fragment>
            { evaluateVesselXPosition() && evaluateVesselYPosition() && renderVessel() }
        </Fragment>
    )
}

export default Vessel;
