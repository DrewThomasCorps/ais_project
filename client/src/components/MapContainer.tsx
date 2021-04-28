import React, {useState, useEffect} from 'react';
import Map from './Map';
import SearchMenu from './SearchMenu';
import TileData from "../interfaces/TileData";
import CurrentFocusCoordinates from "../interfaces/CurrentFocusCoordinates";
import VesselMapObject from "../interfaces/VesselMapObject";
import PortMapObject from "../interfaces/PortMapObject";
import Requests from "../Requests";
import MapHelpers from "../MapHelpers";

/**
 * `MapContainer` contains the state and state handlers for a rendered map. `MapContainer` passes app level GUI logic
 * down to the `SearchMenu` and vessel and port location data down to the `Map` component. `MapContainer` updates its state
 * when a user toggles zoom modes, zooms in or out, or a background tile changes.
 *
 * `Map Container` state includes the following:
 * - root tile data
 * - current zoom mode
 * - current cursor focus
 * - tile data
 * - vessel data
 * - port data
 *
 * @returns JSX.Element that includes a `section` with nested `SearchMenu` and `Map` components.
 */
const MapContainer = () => {
    /**
     * `rootTile` is set to improve the UX. The tile listed in rootTile is used to render the tile that is displayed
     * initially.
     */
    const rootTile = {"id": 1, "ICESName": "-1", "west": 7.0, "south": 54.5, "east": 13.0, "north": 57.5,
        "scale": 1, "filename": "ROOT.png", "image_width": 2000, "image_height": 2000, "image_west": 7.0,
        "image_south": 54.31614, "image_east": 13.0, "image_north": 57.669343, "contained_by": -1}

    /**
     * The following state variables control the state of the GUI and the vessel and port data which is passed down to
     * `SearchMenu` and `Map` components.
     */
    const [currentZoom, setCurrentZoom] = useState<number>(1);
    const [zoomMode, setZoomMode] = useState<string>('');
    const [currentFocus, setCurrentFocus] = useState<CurrentFocusCoordinates>({ longitude: 0, latitude: 0 });
    const [tile, setTile] = useState<TileData>(rootTile);
    const [vessels, setVessels] = useState<VesselMapObject[]>([{imo: '123456', longitude: 8.204047217537942, latitude: 56.913153456998316}]);
    const [ports, setPorts] = useState<PortMapObject[]>([]);

    /**
     * When the component mounts, the following `useEffect` hook gets port data from the database and runs the `updateVesselPositions` function.
     */
    useEffect(() => {
        getPorts();
        updateVesselPositions();
    },[]);

    /**
     * This hook updates the tile that is currently displayed when a user zooms in or out.
     */
    useEffect(() => {
        if (currentFocus["longitude"] !== 0 && currentFocus["latitude"] !== 0) {
            getTile();
        }
    }, [currentZoom]);

    /**
     * This hook runs the methods that update vessel and port locations based on the current tile data.
     */
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

    /**
     * `updateVesselPositions` gets vessel positions from the database on the interval specified below.
     */
    const updateVesselPositions = ()  => {
        getVesselPositions();
        const interval = setInterval(() => getVesselPositions(), 20000)
        return () => {
            clearInterval(interval);
        }
    }

    const setDefaultState = () => {
        setCurrentZoom(1);
        setTile(rootTile);
    }

    /**
     * `mapVessels` enriches each vessel object to include x and y positions based on the current tile's boundaries.
     */
    const mapVessels = () => {
        let newVessels: VesselMapObject[];

        newVessels = vessels.map( vessel => {
            return { ...vessel,
                xPosition: MapHelpers.getXPosition(vessel["longitude"], tile),
                yPosition: MapHelpers.getYPosition(vessel["latitude"], tile) }});

        setVessels(newVessels);
    }

    /**
     * `updatePortLocations` recalculates x and y positions based on the current tile's boundaries.
     */
    const updatePortLocations = () => {
        let newPorts: PortMapObject[];

        newPorts = ports.map( port => {
            return { ...port,
                xPosition: MapHelpers.getXPosition(port["longitude"], tile),
                yPosition: MapHelpers.getYPosition(port["latitude"], tile) }
        });

        setPorts(newPorts);
    }

    /**
     * This function handles user clicks on the map by managing the current focus state and zoom level of the application.
     * @param e
     */
    const handleClick = (e: { preventDefault: () => void; pageX: number; pageY: number;}) => {
        let newFocus = { longitude: MapHelpers.calculateMapX(e, tile), latitude: MapHelpers.calculateMapY(e, tile)};

        setCurrentFocus(newFocus);
        changeZoom();
    }

    /**
     * This function controls the toggle of the zoom mode for the application.
     */
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

    /**
     * This function controls the current zoom level of the application while zooming in.
     */
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

    /**
     * This function controls the current zoom level of the application while zooming out.
     */
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

    /**
     * This function enriches port objects by setting x and y positions relative to the boundaries of a current tile.
     * @param portArray
     */
    const mapPorts = (portArray: PortMapObject[]) => {
        let newPorts: PortMapObject[];

        newPorts = portArray.map( port => {
            // @ts-ignore
            // spread operator can only be used on object types
            return { ...port,
                xPosition: MapHelpers.getXPosition(port["longitude"], tile),
                yPosition: MapHelpers.getYPosition(port["latitude"], tile) }});

        return newPorts;
    }

    /**
     * `getPorts` gets the ports form the database and sets state level `ports` to the response.
     */
    const getPorts = async () => {
        const ports: PortMapObject[] = await Requests.getPorts();
        setPorts(mapPorts(ports));
    }

    const getVesselPositions = () => {
        console.log('Getting updated vessel positions from AIS message endpoint.');
    }

    /**
     * This function gets a background tile based on the application's current focus and zoom
     */
    const getTile = async () => {
        const imageData: TileData = await Requests.getTileData(currentFocus, currentZoom);
        setTile(imageData);
    }

    return (
        <section className={`map-container ${zoomMode}`}>
            <SearchMenu zoomMode={zoomMode} setZoomMode={setZoomMode}/>
            {tile && <Map currentImageId={tile.id} ports={ports} vessels={vessels} currentZoom={currentZoom} handleClick={handleClick}/> }
        </section>
    )
}

export default MapContainer;
