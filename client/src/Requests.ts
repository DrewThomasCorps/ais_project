import CurrentFocusCoordinates from "./interfaces/CurrentFocusCoordinates";
import TileData from "./interfaces/TileData";
import PortMapObject from "./interfaces/PortMapObject";
import VesselMapObject from "./interfaces/VesselMapObject";

export default class Requests {
    static getBaseUrl() {
        return `http://${process.env['REACT_APP_NODE_HOSTNAME']}:${process.env['REACT_APP_NODE_PORT']}/`
    }

    static async getResponseData(endpoint: string): Promise<any>
    {
        const response = await fetch(`${Requests.getBaseUrl()}${endpoint}`);
        return await response.json();
    }

    static async getTileData(currentFocus: CurrentFocusCoordinates, currentZoom: number): Promise<TileData>
    {
        return await Requests.getResponseData(`tiles?longitude=${currentFocus.longitude}&latitude=${currentFocus.latitude}&scale=${currentZoom}`);
    }

    static async getPorts(): Promise<PortMapObject[]>
    {
        return Requests.getResponseData(`ports?mapview_1=1`);
    }

    static async getRecentVesselPositions(): Promise<VesselMapObject[]>
    {
        return Requests.getResponseData(`recent-ship-positions`);
    }
}
