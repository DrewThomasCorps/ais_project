import React, {Fragment} from 'react';

const Map = ({ currentZoom, setCurrentZoom }: {currentZoom: number, setCurrentZoom: any}) => {

    const renderMapImages = () => {
        let images = <Fragment/>

        switch (currentZoom) {
            case 1:
                images = <Fragment>
                    <img src={`./resources/ROOT.png`} className={`map-image`} alt={``}/>
                </Fragment>
                break;
            case 2:
                images = <Fragment>
                    <img src={`./resources/38G0.png`} className={`map-image`} alt={``}/>
                </Fragment>
                break;
            case 3:
                images = <Fragment>
                    <img src={`./resources/38G01.png`} className={`map-image`} alt={``}/>
                </Fragment>
                break;

        }

        return images;
    }

    return (
        <Fragment>
            <div className={`map-image-container`} onClick={setCurrentZoom}>
                {renderMapImages()}
            </div>
        </Fragment>
    )
}

export default Map;
