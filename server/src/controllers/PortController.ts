import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import {DatabaseConfig} from "../config/DatabaseConfig";
import PortDaoFactory from "../daos/factory/PortDaoFactory";
import PortQueryBuilder from "../queryBuilder/PortQueryBuilder";
import Port from "../models/Port";

export default class PortController {
    static getPorts = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const portQueryBuilder = new PortQueryBuilder(requestUrl);
        const portDao = await PortDaoFactory.getPortDao(DatabaseConfig.Config);
        const ports = await portDao.findAll(portQueryBuilder.buildFilterModel());

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify(ports));
    }

    static findPort = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const portDao = await PortDaoFactory.getPortDao(DatabaseConfig.Config);
        const port = await portDao.find(id);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(port));
    }

    static createPort = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const portDao = await PortDaoFactory.getPortDao(DatabaseConfig.Config);
            const port = await portDao.insert(Port.fromJson(body));
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(port))
        })
    }

    static updatePort = async (request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const id = requestUrl.pathname.split('/')[2] ?? ''
            const portDao = await PortDaoFactory.getPortDao(DatabaseConfig.Config);
            const port = await portDao.update(id, Port.fromJson(body));
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(port))
        })
    }

    static deletePort = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const portDao = await PortDaoFactory.getPortDao(DatabaseConfig.Config);
        await portDao.delete(id);
        response.statusCode = 204;
        response.setHeader('Content-Type', 'application/json');
        response.end();
    }
}
