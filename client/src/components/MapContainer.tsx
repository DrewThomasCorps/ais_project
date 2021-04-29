import React, {useState, useEffect} from 'react';
import Map from './Map';
import SearchMenu from './SearchMenu';
import TileData from "../interfaces/TileData";
import CurrentFocusCoordinates from "../interfaces/CurrentFocusCoordinates";
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

    /**
     * This hook updates the tile that is currently displayed when a user zooms in or out.
     */
    useEffect(() => {
        if (currentFocus["longitude"] !== 0 && currentFocus["latitude"] !== 0) {
            getTile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentZoom, currentFocus]);

    /**
     * Resets container state to default if a tile is undefined for the focus region.
     */
    useEffect(() => {
        if (tile === undefined) {
            // TODO Create alert component
            console.log('Target image does not exist');
            setDefaultState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tile]);

    /**
     * This method sets the container to its default state.
     */
    const setDefaultState = () => {
        setCurrentZoom(1);
        setTile(rootTile);
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
     * This function gets a background tile based on the application's current focus and zoom
     */
    const getTile = async () => {
        const imageData: TileData = await Requests.getTileData(currentFocus, currentZoom);
        setTile(imageData);
    }

    return (
        <section className={`map-container ${zoomMode}`}>
            <SearchMenu zoomMode={zoomMode} setZoomMode={setZoomMode}/>
            {tile && <Map tile={tile} currentZoom={currentZoom} handleClick={handleClick}/> }
        </section>
    )
}

export default MapContainer;
