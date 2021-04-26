import CurrentFocusCoordinates from "./interfaces/CurrentFocusCoordinates";
import ImageData from "./interfaces/ImageData";
import PortMapObject from "./interfaces/PortMapObject";

export default class Requests {
    static getBaseUrl() {
        return `http://${process.env['REACT_APP_NODE_HOSTNAME']}:${process.env['REACT_APP_NODE_PORT']}/`
    }

    static async getResponseData(endpoint: string): Promise<any>
    {
        const response = await fetch(`${Requests.getBaseUrl()}${endpoint}`);
        return await response.json();
    }

    static async getImageData(currentFocus: CurrentFocusCoordinates, currentZoom: number): Promise<ImageData>
    {
        const data: ImageData[] = await Requests.getResponseData(`tiles?longitude=${currentFocus.longitude}&latitude=${currentFocus.latitude}&scale=${currentZoom}`);
        return data[0];
    }

    static async getPorts(): Promise<PortMapObject[]>
    {
        return Requests.getResponseData(`ports?mapview_1=1`);
    }
}
