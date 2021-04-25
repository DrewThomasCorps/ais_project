import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import VesselDaoFactory from "../daos/factory/VesselDaoFactory";
import {DatabaseConfig} from "../config/DatabaseConfig";
import VesselQueryBuilder from "../queryBuilder/VesselQueryBuilder";
import Vessel from "../models/Vessel";

export default class VesselController {
    static getVessels = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const vesselQueryBuilder = new VesselQueryBuilder(requestUrl);
        const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Config);
        const vessels = await vesselDao.findAll(vesselQueryBuilder.buildFilterModel());

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(vessels));
    }

    static findVessel = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Config);
        const vessel = await vesselDao.find(id);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(vessel));
    }

    static createVessel = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Config);
            const vessel = await vesselDao.insert(Vessel.fromJson(body));
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(vessel))
        })
    }

    static updateVessel = async (request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const id = requestUrl.pathname.split('/')[2] ?? ''
            const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Config);
            const vessel = await vesselDao.update(id, Vessel.fromJson(body));
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(vessel))
        })
    }

    static deleteVessel = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const vesselDao = await VesselDaoFactory.getVesselDao(DatabaseConfig.Config);
        await vesselDao.delete(id);
        response.statusCode = 204;
        response.setHeader('Content-Type', 'application/json');
        response.end();
    }
}

