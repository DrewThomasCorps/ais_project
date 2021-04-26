import React, {useState, useEffect} from 'react';
import Map from './Map';
import SearchMenu from './SearchMenu';
import ImageData from "../interfaces/ImageData";
import MapObject from "../interfaces/MapObject";
import CurrentFocusCoordinates from "../interfaces/CurrentFocusCoordinates";
import VesselMapObject from "../interfaces/VesselMapObject";
import Requests from "../Requests";

const MapContainer = () => {
    const [currentZoom, setCurrentZoom] = useState<number>(1);
    const [zoomMode, setZoomMode] = useState<string>('');
    const [currentFocus, setCurrentFocus] = useState<CurrentFocusCoordinates>({ longitude: 0, latitude: 0 });

    const rootImage = {"id": 1, "ICESName": "-1", "west": 7.0, "south": 54.5, "east": 13.0, "north": 57.5,
        "scale": 1, "filename": "ROOT.png", "image_width": 2000, "image_height": 2000, "image_west": 7.0,
        "image_south": 54.31614, "image_east": 13.0, "image_north": 57.669343, "contained_by": -1}

    const [currentImageId, setCurrentImageId] = useState<number>(1);
    const [currentImageData, setCurrentImageData] = useState<ImageData>(rootImage);

    const [vessels, setVessels] = useState<VesselMapObject[]>([{imo: '123456', longitude: 8.204047217537942, latitude: 56.913153456998316}]);
    const [ports, setPorts] = useState<MapObject[]>([{longitude: 9.885278, latitude: 55.269167},
        {longitude: 10.053333, latitude: 56.684722},
        {longitude: 10.670556, latitude: 56.194444},
        {longitude: 10.234722, latitude: 55.095278}
    ]);

    useEffect(() => {
        getVesselPositions()
        const interval = setInterval(() => getVesselPositions(), 30000)
        return () => {
            clearInterval(interval);
        }
    }, [])

    useEffect(() => {
        if (currentFocus["longitude"] !== 0 && currentFocus["latitude"] !== 0) {
            getNewImage();
        }
    }, [currentZoom, currentFocus]);

    useEffect(() => {
        if (currentImageData !== undefined) {
            setCurrentImageId(currentImageData.id);
            mapVessels();
            mapPorts();
        } else {
            // TODO Create alert component
            console.log('Target image does not exist');
            setCurrentImageData(rootImage);
        }

    }, [currentImageData]);

    const mapVessels = () => {
        let newVessels: VesselMapObject[];

        newVessels = vessels.map( vessel => { return { imo: vessel["imo"], longitude: vessel["longitude"], latitude: vessel["latitude"], xPosition: calculateObjectXPosition(vessel), yPosition: calculateObjectYPosition(vessel) }});

        setVessels(newVessels);
    }

    const mapPorts = () => {
        let newPorts: MapObject[];

        newPorts = ports.map( port => { return { longitude: port["longitude"], latitude: port["latitude"], xPosition: calculateObjectXPosition(port), yPosition: calculateObjectYPosition(port) }});

        setPorts(newPorts);
    }

    const calculateObjectXPosition = (targetObject: MapObject) => {
        return (targetObject["longitude"] - currentImageData.image_west) / (currentImageData.image_east - currentImageData.image_west) * 100
    };

    const calculateObjectYPosition = (targetObject: MapObject) => {
        return (currentImageData.image_north - targetObject["latitude"]) / (currentImageData.image_north - currentImageData.image_south) * 100
    };

    const handleClick = (e: { preventDefault: () => void; pageX: number; pageY: number;}) => {
        e.preventDefault();

        if (currentImageData !== undefined) {
            let newFocus = {
                longitude: calculateMapX(e),
                latitude: calculateMapY(e)
            }

            setCurrentFocus(newFocus);

            changeZoom();
        }
    }

    const calculateMapX = (e: any): number => {
        let divLeft, divWidth: number;

        divLeft = document.getElementById('map')!.offsetLeft;
        divWidth = document.getElementById('map')!.offsetWidth;

        return currentImageData.west + (currentImageData.east - currentImageData.west) * ((e.pageX - divLeft) / divWidth);
    }

    const calculateMapY = (e: any): number => {
        let divTop, divHeight: number;

        divTop = document.getElementById('map')!.offsetTop;
        divHeight = document.getElementById('map')!.offsetHeight;

        return currentImageData.south + (currentImageData.north - currentImageData.south) * (1 - ((e.pageY - divTop) / divHeight));
    }

    const changeZoom = () => {
        switch (zoomMode) {
            case 'in':
                zoomIn();
                break;
            case 'out':
                zoomOut();
                break;
        }
    }

    const zoomIn = () => {
        switch (currentZoom) {
            case 1:
                setCurrentZoom(2);
                break;
            case 2:
            case 3:
                setCurrentZoom(3);
                break;
        }
    }

    const zoomOut = () => {
        switch (currentZoom) {
            case 1:
            case 2:
                setCurrentZoom(1);
                break;
            case 3:
                setCurrentZoom(2);
                break;
        }
    }

    const getNewImage = async () => {
        const imageData: ImageData = await Requests.getImageData(currentFocus, currentZoom);
        setCurrentImageData(imageData);
    }


    const getVesselPositions = () => {
        console.log('Getting updated vessel positions from AIS message endpoint.');
    }

    return (
        <section className={`map-container ${zoomMode}`}>
            <SearchMenu zoomMode={zoomMode} setZoomMode={setZoomMode}/>
            {currentImageId && <Map currentImageId={currentImageId} ports={ports} vessels={vessels} handleClick={handleClick}/> }
        </section>
    )
}

export default MapContainer;
