import {IncomingMessage, ServerResponse} from "http";

const http = require('http');
const { URL } = require('url');

module.exports = http.createServer((request: IncomingMessage, response: ServerResponse) => {
    let vesselController = require('./vesselController.ts');

    const requestUrl =  new URL(request.url, 'http://localhost:3000/');

    if (/^\/vessels\/*/.test(requestUrl.pathname) && request.method === 'GET') {
        vesselController.getVessels(request, response, requestUrl);
    } else if (requestUrl.pathname == '/vessels' && request.method === 'POST') {
        vesselController.createVessel(request, response);
    } else {
        invalidUrl(request, response);
    }
});

const invalidUrl = (_request: IncomingMessage, response: ServerResponse) => {
    let responseData = [
        {
            "message": "Invalid endpoint"
        }
    ]

    response.statusCode = 404;
    response.setHeader('content-Type', 'Application/json');
    response.end(JSON.stringify(responseData))
}
