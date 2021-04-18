import React, {useState} from 'react';

import Map from './Map'

const MapContainer = () => {
    const [currentZoom, setCurrentZoom] = useState(1);
    const [zoomMode, setCurrentZoomMode] = useState('in');
    const [currentFocus, setCurrentFocus] = useState({
        longitude: 0,
        latitude: 0,
    });
    const [images] = useState([
        {   "id": 1,
            "ICESName": "-1",
            "west": 7.0,
            "south": 54.5,
            "east": 13.0,
            "north": 57.5,
            "scale": 1,
            "filename": "ROOT.png",
            "image_width": 2000, "image_height": 2000, "image_west": 7.0, "image_south": 54.31614, "image_east": 13.0, "image_north": 57.669343, "contained_by": -1},
        {"id": 5330, "ICESName": "38G0", "west": 10.0, "south": 54.5, "east": 11.0, "north": 55.0, "scale": 2, "filename": "38G0.png", "image_width": 2000, "image_height": 2000, "image_west": 10.0, "image_south": 54.461175, "image_east": 11.0, "image_north": 55.038312, "contained_by": -1},
        {"id": 53301, "ICESName": "38G01", "west": 10.0, "south": 54.75, "east": 10.5, "north": 55.0, "scale": 3, "filename": "38G01.png", "image_width": 2000, "image_height": 2000, "image_west": 10.0, "image_south": 54.731097, "image_east": 10.5, "image_north": 55.018777, "contained_by": 5330},
        {"id": 53302, "ICESName": "38G02", "west": 10.5, "south": 54.75, "east": 11.0, "north": 55.0, "scale": 3, "filename": "38G02.png", "image_width": 2000, "image_height": 2000, "image_west": 10.5, "image_south": 54.731097, "image_east": 11.0, "image_north": 55.018777, "contained_by": 5330},
        {"id": 53303, "ICESName": "38G03", "west": 10.0, "south": 54.5, "east": 10.5, "north": 54.75, "scale": 3, "filename": "38G03.png", "image_width": 2000, "image_height": 2000, "image_west": 10.0, "image_south": 54.480204, "image_east": 10.5, "image_north": 54.769665, "contained_by": 5330},
        {"id": 53304, "ICESName": "38G04", "west": 10.5, "south": 54.5, "east": 11.0, "north": 54.75, "scale": 3, "filename": "38G04.png", "image_width": 2000, "image_height": 2000, "image_west": 10.5, "image_south": 54.480204, "image_east": 11.0, "image_north": 54.769665, "contained_by": 5330}]);
    const [currentImage, setCurrentImage] = useState(images[0]);

    const handleClick = (e: { preventDefault: () => void; pageX: number; pageY: number;}) => {
        e.preventDefault();
        console.log(calculateMapX(e) + ', ' + calculateMapY(e));
        changeZoom();
    }

    const calculateMapX = (e: any): number => {
        let divLeft, divWidth: number;

        divLeft = document.getElementById('map')!.offsetLeft;
        divWidth = document.getElementById('map')!.offsetWidth;

        return currentImage.west + (currentImage.east - currentImage.west) * ((e.pageX - divLeft) / divWidth);
    }

    const calculateMapY = (e: any): number => {
        let divTop, divHeight: number;

        divTop = document.getElementById('map')!.offsetTop;
        divHeight = document.getElementById('map')!.offsetHeight;

        return currentImage.south + (currentImage.north - currentImage.south) * (1 - ((e.pageY - divTop) / divHeight));
    }

    const changeZoom = () => {
        if (zoomMode === 'in') {
            zoomIn();
        }
    }

    const zoomIn = () => {
        switch (currentZoom) {
            case 1:
                setCurrentZoom(2);
                break;
            case 2:
                setCurrentZoom(3);
                break;
            case 3:
                setCurrentZoom(1);
                break;
        }
    }



    return (
        <section className={`map-container`}>
            {currentImage.filename && <Map currentImageName={currentImage.filename} handleClick={handleClick}/> }
        </section>
    )
}

export default MapContainer;
