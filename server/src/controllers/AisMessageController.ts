import {IncomingMessage, ServerResponse} from "http";
import {DatabaseConfig} from "../config/DatabaseConfig";
import DaoFactory from "../daos/factory/DaoFactory";
import AisMessage from "../models/AisMessage";
import {URL} from "url";

export default class AisMessageController {

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

    static deleteAisMessagesFiveMinutesOlderThanTime = async (_request: IncomingMessage, response: ServerResponse, requestUrl: URL) => {
        const time = requestUrl.searchParams.get('time');
        const aisMessageDao = await DaoFactory.getAisMessageDao(DatabaseConfig.Config);
        const deletedMessages = await aisMessageDao.deleteMessagesFiveMinutesOlderThanTime(new Date(time ?? ''));

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.end(JSON.stringify({deletedMessages: deletedMessages}));
    }

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

