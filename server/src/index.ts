import {IncomingMessage, ServerResponse} from "http";
import EnvironmentHandler from "./EnvironmentHandler";
import VesselDaoFactory from "./daos/factory/VesselDaoFactory";
import {DatabaseConfig} from "./config/DatabaseConfig";
import Mongo from "./daos/databases/Mongo";

const http = require('http');

const environmentHandler = new EnvironmentHandler(".env");
environmentHandler.setUp();

const server = http.createServer(async (_request: IncomingMessage, response: ServerResponse) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/plain');
        const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Mongo);
        const vessel = await vesselDao.find("607a5d3c2272cc9939207c80")
        await Mongo.closeDatabase();
        response.end(`IMO: ${vessel.imo}`);
});

server.listen(process.env["NODE_PORT"], process.env["NODE_HOSTNAME"], () => {
    console.log(`Server running at http://${process.env["NODE_HOSTNAME"]}:${process.env["NODE_PORT"]}/`);
});
