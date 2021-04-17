import {IncomingMessage, ServerResponse} from "http";

const MongoClient = require('mongodb').MongoClient;
const dbName = 'ais_project';

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((_request: IncomingMessage, response: ServerResponse) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');

    const client = new MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});
    try {
        client.connect().then((client: any) => {
            const vessels = client.db(dbName).collection('vessels');
            vessels.find({IMO: 1000186}).toArray().then((vessels: any) => {
                response.end(`IMO: ${vessels[0].IMO} | Built: ${vessels[0].Built}`);
            })

        })

    } finally {
        // client.close();
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
