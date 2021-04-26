import CurrentFocusCoordinates from "./interfaces/CurrentFocusCoordinates";
import ImageData from "./interfaces/ImageData";

export default class Requests {
    static getBaseUrl() {
        return `http://${process.env['REACT_APP_NODE_HOSTNAME']}:${process.env['REACT_APP_NODE_PORT']}/`
    }

    static async getImageData(currentFocus: CurrentFocusCoordinates, currentZoom: number): Promise<ImageData>
    {
        const response = await fetch(`${Requests.getBaseUrl()}tiles?longitude=${currentFocus.longitude}&latitude=${currentFocus.latitude}&scale=${currentZoom}`);
        const data: ImageData[] = await response.json();
        return data[0];
    }
}
