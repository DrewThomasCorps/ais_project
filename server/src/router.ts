import http, {IncomingMessage, ServerResponse} from "http";
import VesselController from "./controllers/VesselController";
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
