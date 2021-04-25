import http, {IncomingMessage, ServerResponse} from "http";
import VesselController from "./controllers/VesselController";
import TileController from "./controllers/TileController";
import {URL} from "url";

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
    } else {
        invalidUrl(request, response);
    }
});

const invalidUrl = (_request: IncomingMessage, response: ServerResponse) => {
    let responseData = {"message": "Invalid endpoint"}
    response.statusCode = 404;
    response.setHeader('content-Type', 'Application/json');
    response.end(JSON.stringify(responseData))
}
