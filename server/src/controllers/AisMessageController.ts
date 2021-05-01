import {IncomingMessage, ServerResponse} from "http";
import {DatabaseConfig} from "../config/DatabaseConfig";
import DaoFactory from "../daos/factory/DaoFactory";
import AisMessage from "../models/AisMessage";
import {URL} from "url";

/**
 * Controller to handle server requests for AIS Messages
 */
export default class AisMessageController {

    /**
     * Creates a batch of AIS messages if an array is passed, or a single position_report or static_data message if an
     * abject is passed.
     * @param request
     * @param response
     */
    static createAisMessages = async (request: IncomingMessage, response: ServerResponse) => {
        let body = '';

        request.on('data', (chunk: any) => {
            body += chunk;
        });

        request.on('end', async () => {
            const aisMessageDao = await DaoFactory.getAisMessageDao(DatabaseConfig.Config);
            const parsedBody = JSON.parse(body);
            let insertedCount = 0;
            if (Array.isArray(parsedBody)) {
                insertedCount = await aisMessageDao.insertBatch(parsedBody.map((aisMessage) => {
                    return AisMessage.fromJson(JSON.stringify(aisMessage));
                }))
            } else {
                const insertedAisMessage = await aisMessageDao.insert(AisMessage.fromJson(body));
                insertedCount = insertedAisMessage ? 1 : 0;
            }

            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({insertedCount: insertedCount}))
        })
    }

    /**
     * Deletes all AIS messages more than 5 minutes older than the time passed in the query string.
     * @param _request
     * @param response
     * @param requestUrl
     */
    static deleteAisMessagesFiveMinutesOlderThanTime = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const time = requestUrl.searchParams.get('time');
        const aisMessageDao = await DaoFactory.getAisMessageDao(DatabaseConfig.Config);
        const deletedMessages = await aisMessageDao.deleteMessagesFiveMinutesOlderThanTime(new Date(time ?? ''));

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify({deletedMessages: deletedMessages}));
    }

    /**
     * Finds the most recent positions as found in position_report documents.
     *
     * If a MMSI is passed in the query string, the last position for that vessel will be returned.
     * If a tile ID is passed in the query string, all most recent positions within that tile will be returned.
     * Else all the most recent positions for every ship will be returned.
     * @param response
     * @param requestUrl
     */
    static getPositions = async (response: ServerResponse, requestUrl: URL) => {
        let positions;
        const aisMessageDao = await DaoFactory.getAisMessageDao(DatabaseConfig.Config)
        const mmsi = requestUrl.searchParams.get(('mmsi'));
        const tileId = requestUrl.searchParams.get(('tile_id'))
        if (mmsi) {
            positions = await aisMessageDao.findMostRecentPositionForMmsi(Number.parseInt(mmsi));
        } else if (tileId) {
            positions = await aisMessageDao.findMostRecentPositionsInTile(Number.parseInt(tileId))
        } else {
            positions =  await aisMessageDao.findMostRecentShipPositions();
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify(positions));
    }
}

