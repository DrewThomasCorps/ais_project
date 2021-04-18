import {IncomingMessage, ServerResponse} from "http";
import {MongoClient} from "mongodb";
import EnvironmentHandler from "./EnvironmentHandler";

const dbName = 'ais_project';

const http = require('http');

const environmentHandler = new EnvironmentHandler(".env");

const server = http.createServer((_request: IncomingMessage, response: ServerResponse) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');

    const client = new MongoClient('mongodb://localhost:27017', {useUnifiedTopology: true});
    try {
        client.connect().then((client: MongoClient) => {
            const vessels = client.db(dbName).collection('vessels');
            vessels.find({IMO: 1000186}).toArray().then((vessels: any) => {
                response.end(`IMO: ${vessels[0].IMO} | Built: ${vessels[0].Built}`);
            })

        })

    } finally {
        // client.close();
    }
});
environmentHandler.setUp();
server.listen(process.env["NODE_PORT"], process.env["NODE_HOSTNAME"], () => {
    console.log(`Server running at http://${process.env["NODE_PORT"]}:${process.env["NODE_HOSTNAME"]}/`);
});
