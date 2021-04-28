import {IncomingMessage, ServerResponse} from "http";
import {URL} from "url";
import {DatabaseConfig} from "../config/DatabaseConfig";
import {Readable} from "stream";
import TileDaoFactory from "../daos/factory/TileDaoFactory";
import Tile from "../models/Tile";

/**
 * The `TileController` controls `Tile` requests and responses for basic CRUD methods as well as methods to get `Tile`
 * image files, find tiles contained by other tiles, and find tiles based on coordinates.
 * ## Covers Project Queries
 * - [[getTileImage]] - *Given a tile Id, get the actual tile (a PNG file)*
 * - [[findContainedTiles]] - *Given a background map tile for zoom level 1 (2), find the 4 tiles of zoom level 2 (3) that are contained in it;*
 */
export default class TileController {

    static createTile = (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
            const tile = await tileDao.insert(Tile.fromJson(body));
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(tile))
        })
    }

    static updateTile = async (request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const id = requestUrl.pathname.split('/')[2] ?? ''
            const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
            const tile = await tileDao.update(id, Tile.fromJson(body));
            response.statusCode = 200;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(tile))
        })
    }

    static deleteTile = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        await tileDao.delete(id);
        response.statusCode = 204;
        response.setHeader('Content-Type', 'application/json');
        response.end();
    }

    static getTiles = async (_request: IncomingMessage, response: ServerResponse, _requestUrl: URL) => {
        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        const tiles = await tileDao.findAll();

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(tiles));
    }

    /**
     * ### Description
     * Gets a tile image from the database by the tile `id` given in the request URL.
     *
     * - Request Type: GET
     * - Response Type: image/png
     * - Example Request Endpoint: `/tile-image/1`
     * @param _request
     * @param response
     * @param requestUrl
     */
    static getTileImage = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const parentTileId = requestUrl.pathname.split('/')[2];
        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        const tile = await tileDao.getTileImage(parseInt(parentTileId ?? '', 10));

        const buffer = Buffer.from(tile.image_file ?? '', 'binary');
        const readable = new Readable();
        readable._read = () => {}; // _read is required but you can noop it
        readable.push(buffer);
        readable.push(null);

        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'image/png',
            'Content-Length': readable.readableLength
        });

        readable.pipe(response);
    }

    /**
     * ### Description
     * Gets tiles from database that are `contained_in` the parent tile `id` given in the request URL.
     *
     * - Request Type: GET
     * - Example Request Endpoint: `tile-data/-1`
     * @param _request
     * @param response
     * @param _requestUrl
     */
    static findContainedTiles = async (_request: IncomingMessage, response: ServerResponse, _requestUrl: URL) => {
        const parentTileId = _requestUrl.pathname.split('/')[2];
        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        const tiles = await tileDao.findContainedTiles(parseInt(<string>parentTileId, 10));

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify(tiles));
    }

    /**
     * Finds tiles by creating queryObject based on given longitude and latitude from search parameters.
     * @param _request
     * @param response
     * @param _requestUrl
     */
    static findTilesByCoordinates = async (_request: IncomingMessage, response: ServerResponse, _requestUrl: URL) => {
const scale = parseInt(<string>_requestUrl.searchParams.get("scale"), 10);
        const longitude = parseFloat(<string>_requestUrl.searchParams.get("longitude"));
        const latitude = parseFloat(<string>_requestUrl.searchParams.get("latitude"));

        const queryObject = {
            image_west: {$lte: longitude},
            image_east: {$gt: longitude},
            image_north: {$gt: latitude},
            image_south: {$lte: latitude},
            scale: scale }

        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        const tiles = await tileDao.findTilesByCoordinates(queryObject);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify(tiles));
    }

    /**
     * Finds a title from the id given in the request URL path name.
     * @param _request
     * @param response
     * @param requestUrl
     */
    static findTile = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const id = requestUrl.pathname.split('/')[2] ?? '';
        const tileDao = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
        const tile = await tileDao.find(id);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(tile));
    }
}
