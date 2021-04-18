import React, {Fragment} from 'react';

const Map = ({ currentImageName, handleClick }: {currentImageName: string, handleClick: any}) => {

    return (
        <Fragment>
            <div className={`map-image-container`} id={`map`} onClick={handleClick}>
                { currentImageName &&
                    <svg viewBox="0 0 100 100" className="map-image"
                         style={{backgroundImage: `url("./resources/${currentImageName}")`, backgroundSize: `cover`}}>
                        <circle cx="12.5" cy="6.7" r="3" strokeWidth="1" stroke="#FF000055" fill="#FF000055">
                            <animate attributeType="SVG" attributeName="r" begin="0s" dur="2.0s" repeatCount="indefinite" from="0%" to="1%"/>
                            <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur="2.0s" repeatCount="indefinite" from="0%" to="4%" />
                            <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur="2.0s" repeatCount="indefinite" from="1" to="0"/>
                        </circle>
                    </svg>
                }


            </div>
        </Fragment>
    )
}

export default Map;
