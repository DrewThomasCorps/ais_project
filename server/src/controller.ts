import {IncomingMessage, ServerResponse} from "http";

const MongoClient = require('mongodb').MongoClient;
const dbName = 'ais_project';

exports.getVessels = (_request: IncomingMessage, response: ServerResponse) => {
    const client = new MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});

    try {
        client.connect().then((client: any) => {
            const vessels = client.db(dbName).collection('vessels');

            vessels.find().limit(10).toArray().then((vessels: any) => {
                response.statusCode = 200;
                response.setHeader('content-Type', 'Application/json');
                response.end(JSON.stringify(vessels));
            })
        })
    } finally {
        // client.close();
    }
}

exports.createVessel = (request: IncomingMessage, response: ServerResponse) => {
    let body = '';

    request.on('data',  (chunk: any) => {
        body += chunk;
    });

    request.on('end', () => {
        const responseBody = JSON.parse(body);

        response.statusCode = 201;
        response.setHeader('content-Type', 'Application/json');
        response.end(JSON.stringify(responseBody))
    })
}
