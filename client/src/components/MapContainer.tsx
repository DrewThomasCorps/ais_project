import React, {useState, useEffect} from 'react';
import Map from './Map';
import SearchMenu from './SearchMenu';
import TileData from "../interfaces/TileData";
import MapObject from "../interfaces/MapObject";
import CurrentFocusCoordinates from "../interfaces/CurrentFocusCoordinates";
import VesselMapObject from "../interfaces/VesselMapObject";
import PortMapObject from "../interfaces/PortMapObject";
import ImageData from "../interfaces/ImageData";
import Requests from "../Requests";

const MapContainer = () => {
    const rootTile = {"id": 1, "ICESName": "-1", "west": 7.0, "south": 54.5, "east": 13.0, "north": 57.5,
        "scale": 1, "filename": "ROOT.png", "image_width": 2000, "image_height": 2000, "image_west": 7.0,
        "image_south": 54.31614, "image_east": 13.0, "image_north": 57.669343, "contained_by": -1}

    const [currentZoom, setCurrentZoom] = useState<number>(1);
    const [zoomMode, setZoomMode] = useState<string>('');
    const [currentFocus, setCurrentFocus] = useState<CurrentFocusCoordinates>({ longitude: 0, latitude: 0 });
    const [tile, setTile] = useState<TileData>(rootTile);
    const [vessels, setVessels] = useState<VesselMapObject[]>([{imo: '123456', longitude: 8.204047217537942, latitude: 56.913153456998316}]);
    const [ports, setPorts] = useState<PortMapObject[]>([]);

    useEffect(() => {
        getPorts();
        updateVesselPositions();
    },[]);

    const getPorts = async () => {
        const ports: PortMapObject[] = await Requests.getPorts();
        setPorts(ports);
    }

    const updateVesselPositions = ()  => {
        getVesselPositions();
        const interval = setInterval(() => getVesselPositions(), 20000)
        return () => {
            clearInterval(interval);
        }
    }

    useEffect(() => {
        if (currentFocus["longitude"] !== 0 && currentFocus["latitude"] !== 0) {
            getTile();
        }
    }, [currentZoom]);

    useEffect(() => {
        if (tile !== undefined) {
            mapVessels();
            updatePortLocations();
        } else {
            // TODO Create alert component
            console.log('Target image does not exist');
            setDefaultState();
        }
    }, [tile]);

    const setDefaultState = () => {
        setCurrentZoom(1);
        setTile(rootTile);
    }

    const mapVessels = () => {
        let newVessels: VesselMapObject[];

        newVessels = vessels.map( vessel => { return { imo: vessel["imo"], longitude: vessel["longitude"], latitude: vessel["latitude"], xPosition: calculateObjectXPosition(vessel), yPosition: calculateObjectYPosition(vessel) }});

        setVessels(newVessels);
    }

    const updatePortLocations = () => {
        let newPorts: PortMapObject[];

        newPorts = ports.map( port => { return { ...port, xPosition: calculateObjectXPosition(port), yPosition: calculateObjectYPosition(port) }});

        setPorts(newPorts);
    }

    const calculateObjectXPosition = (targetObject: MapObject) => {
        return (targetObject["longitude"] - tile.image_west) / (tile.image_east - tile.image_west) * 100
    };

    const calculateObjectYPosition = (targetObject: MapObject) => {
        return (tile.image_north - targetObject["latitude"]) / (tile.image_north - tile.image_south) * 100
    };

    const handleClick = (e: { preventDefault: () => void; pageX: number; pageY: number;}) => {
        let newFocus = { longitude: calculateMapX(e), latitude: calculateMapY(e)};

        setCurrentFocus(newFocus);
        changeZoom();
    }

    const calculateMapX = (e: any): number => {
        let divLeft, divWidth: number;

        divLeft = document.getElementById('map')!.offsetLeft;
        divWidth = document.getElementById('map')!.offsetWidth;

        return tile.west + (tile.east - tile.west) * ((e.pageX - divLeft) / divWidth);
    }

    const calculateMapY = (e: any): number => {
        let divTop, divHeight: number;

        divTop = document.getElementById('map')!.offsetTop;
        divHeight = document.getElementById('map')!.offsetHeight;

        return tile.south + (tile.north - tile.south) * (1 - ((e.pageY - divTop) / divHeight));
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

    const getTile = async () => {
        const imageData: ImageData = await Requests.getImageData(currentFocus, currentZoom);
        setTile(imageData);
    }

    const mapPorts = (portArray: []) => {
        let newPorts: PortMapObject[];

        newPorts = portArray.map( port => {
            // @ts-ignore
            // spread operator can only be used on object types
            return { ...port, xPosition: calculateObjectXPosition(port), yPosition: calculateObjectYPosition(port) }});

        return newPorts;
    }

    const getVesselPositions = () => {
        console.log('Getting updated vessel positions from AIS message endpoint.');
    }

    return (
        <section className={`map-container ${zoomMode}`}>
            <SearchMenu zoomMode={zoomMode} setZoomMode={setZoomMode}/>
            {tile && <Map currentImageId={tile.id} ports={ports} vessels={vessels} currentZoom={currentZoom} handleClick={handleClick}/> }
        </section>
    )
}

export default MapContainer;
