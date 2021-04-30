import http, {IncomingMessage, ServerResponse} from "http";
import VesselController from "./controllers/VesselController";
import TileController from "./controllers/TileController";
import {URL} from "url";
import PortController from "./controllers/PortController";
import AisMessageController from "./controllers/AisMessageController";

/**
 * `router` is responsible for routing all requests to the correct controller method for Vessels, Tiles, Ports, and AIS Messages.
 */
export default http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
    const requestUrl = new URL(request.url ?? '', 'http://localhost:3000');

    if (requestUrl.pathname == '/vessels' && request.method === 'GET') {
        await VesselController.getVessels(request, response, requestUrl);
    } else if (/^\/vessels\/*/.test(requestUrl.pathname) && request.method === 'GET') {
        await VesselController.findVessel(request, response, requestUrl);
    } else if (/^\/vessels\/*/.test(requestUrl.pathname) && request.method === 'PUT') {
        await VesselController.updateVessel(request, response, requestUrl);
    } else if (/^\/vessels\/*/.test(requestUrl.pathname) && request.method === 'DELETE') {
        await VesselController.deleteVessel(request, response, requestUrl);
    } else if (requestUrl.pathname == '/vessels' && request.method === 'POST') {
        await VesselController.createVessel(request, response);
    } else if (/^\/tile-image\/[\-0-9]+/.test(requestUrl.pathname) && request.method === 'GET') {
        await TileController.getTileImage(request, response, requestUrl);
    } else if (/^\/tiles/.test(requestUrl.pathname) && requestUrl.searchParams.get("longitude") && request.method === 'GET') {
        await TileController.findTilesByCoordinates(request, response, requestUrl);
    } else if (/^\/tiles\/[0-9a-z]+/.test(requestUrl.pathname) && request.method === 'GET') {
        await TileController.findTile(request, response, requestUrl);
    } else if (/^\/tiles/.test(requestUrl.pathname) && request.method === 'GET') {
        await TileController.getTiles(request, response, requestUrl);
    } else if (/^\/tiles\/*/.test(requestUrl.pathname) && request.method === 'PUT') {
        await TileController.updateTile(request, response, requestUrl);
    } else if (/^\/tiles\/*/.test(requestUrl.pathname) && request.method === 'DELETE') {
        await TileController.deleteTile(request, response, requestUrl);
    }  else if (/^\/tiles/.test(requestUrl.pathname) && request.method === 'POST') {
        await TileController.createTile(request, response);
    } else if (/^\/tile-data\/[\-0-9]+/.test(requestUrl.pathname) && request.method === 'GET') {
        await TileController.findContainedTiles(request, response, requestUrl);
    } else if (requestUrl.pathname == '/ports' && request.method === 'GET') {
        await PortController.getPorts(request, response, requestUrl);
    }  else if (/^\/ports\/*/.test(requestUrl.pathname) && request.method === 'GET') {
        await PortController.findPort(request, response, requestUrl);
    } else if (/^\/ports\/*/.test(requestUrl.pathname) && request.method === 'PUT') {
        await PortController.updatePort(request, response, requestUrl);
    } else if (/^\/ports\/*/.test(requestUrl.pathname) && request.method === 'DELETE') {
        await PortController.deletePort(request, response, requestUrl);
    } else if (requestUrl.pathname === '/ports' && request.method === 'POST') {
        await PortController.createPort(request, response);
    }  else if (requestUrl.pathname === '/recent-ship-positions' && request.method === 'GET') {
        await AisMessageController.getRecentShipPositions(response);
    } else {
        invalidUrl(request, response);
    }
});

/**
 * Handles the default response when a user tries to hit an invalid endpoint.
 * @param _request
 * @param response
 */
const invalidUrl = (_request: IncomingMessage, response: ServerResponse) => {
    let responseData = {"message": "Invalid endpoint"}
    response.statusCode = 404;
    response.setHeader('content-Type', 'Application/json');
    response.end(JSON.stringify(responseData))
}
