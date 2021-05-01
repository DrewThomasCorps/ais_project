import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import {DatabaseConfig} from "../config/DatabaseConfig";
import DaoFactory from "../daos/factory/DaoFactory";
import PortQueryBuilder from "../queryBuilder/PortQueryBuilder";
import Port from "../models/Port";

/**
 * The `PortController` controls `Port` requests and responses for basic CRUD methods.
 * ## Covers Project Queries
 * - [[getPorts]] - *Read all ports matching the given name and (optional) country*
 */
export default class PortController {
    /**
     * ### Description
     * Gets ports from database that match the search parameters passed through the `requestUrl`. Accepted search
     * parameters include the port name(location), country, mapview_1, mapview_2, and mapview_3.
     *
     * - Request Type: GET
     * - Example Request Endpoint: `ports?name=Ebeltoft&country=Denmark`
     * @param _request
     * @param response
     * @param requestUrl
     */
    static getPorts = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const portQueryBuilder = new PortQueryBuilder(requestUrl);
        const portDao = await DaoFactory.getPortDao(DatabaseConfig.Config);
        const ports = await portDao.findAll(portQueryBuilder.buildFilterModel());

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify(ports));
    }

    /**
     * Finds a port from the id given in the request URL path name.
     * @param _request
     * @param response
     * @param requestUrl
     */
    static findPort = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const portDao = await DaoFactory.getPortDao(DatabaseConfig.Config);
        const port = await portDao.find(id);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(port));
    }

    /**
     * Creates a port document in the `port` collection of the database from the request JSOn body.
     * @param request
     * @param response
     */
    static createPort = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const portDao = await DaoFactory.getPortDao(DatabaseConfig.Config);
            const port = await portDao.insert(Port.fromJson(body));
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(port))
        })
    }

    /**
     * Updates a port document that matches the given id in the request URL pathname with the request JSON body.
     * @param request
     * @param response
     * @param requestUrl
     */
    static updatePort = async (request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const id = requestUrl.pathname.split('/')[2] ?? ''
            const portDao = await DaoFactory.getPortDao(DatabaseConfig.Config);
            const port = await portDao.update(id, Port.fromJson(body));
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(port))
        })
    }

    /**
     * Deletes the port document that matches the id given in the request URL path name.
     * @param _request
     * @param response
     * @param requestUrl
     */
    static deletePort = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const portDao = await DaoFactory.getPortDao(DatabaseConfig.Config);
        await portDao.delete(id);
        response.statusCode = 204;
        response.setHeader('Content-Type', 'application/json');
        response.end();
    }
}
