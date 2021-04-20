import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import VesselDaoFactory from "../daos/factory/VesselDaoFactory";
import {DatabaseConfig} from "../config/DatabaseConfig";
import VesselQueryBuilder from "../queryBuilder/VesselQueryBuilder";

exports.getVessels = async (_request: IncomingMessage, response: ServerResponse, _requestUrl: URL) => {
    const vesselQueryBuilder = new VesselQueryBuilder(_requestUrl);
    const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Mongo);

    console.log(vesselQueryBuilder.buildQuery());

    const vessels = await vesselDao.findAll(vesselQueryBuilder);

    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(vessels));
}

exports.createVessel = (request: IncomingMessage, response: ServerResponse) => {
    let body = '';

    request.on('data', (chunk: any) => {
        body += chunk;
    });

    request.on('end', () => {
        const responseBody = JSON.parse(body);

        response.statusCode = 201;
        response.setHeader('content-Type', 'Application/json');
        response.end(JSON.stringify(responseBody))
    })
}
