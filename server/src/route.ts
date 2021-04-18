import {IncomingMessage, ServerResponse} from "http";

const http = require('http');
const { URL } = require('url');

module.exports = http.createServer((request: IncomingMessage, response: ServerResponse) => {
    let vesselOps = require('./controller.ts');
    const requestUrl =  new URL('/vessels', 'http://localhost:3000/');

    if (requestUrl.pathname == '/vessels' && request.method === 'GET') {
        vesselOps.getVessels(request, response);



    } else if (requestUrl.pathname == '/vessels' && request.method === 'POST') {
        vesselOps.createVessel(request, response);
    }
});
