import React, {Fragment} from 'react';

/**
 * Renders a `Vessel` component with the given `xPosition` and `yPosition`.
 * @param xPosition
 * @param yPosition
 * @constructor
 */
const Vessel = ({ xPosition, yPosition }: {xPosition: number, yPosition: any}) => {
    const animationDuration = '3.0s'
    const color = '#F2423688'

    return (
        <Fragment>
            <circle cx={xPosition} cy={yPosition} r="1" strokeWidth="0" stroke={`${color}`} fill={`${color}`}>
                <animate attributeType="SVG" attributeName="r" begin="0s" dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to="1%"/>
                <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="0%" to="4%" />
                <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur={`${animationDuration}`} repeatCount="indefinite" from="1" to="0"/>
            </circle>
        </Fragment>
    )
}

export default Vessel;
