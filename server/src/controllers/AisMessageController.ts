import {ServerResponse} from "http";
import {DatabaseConfig} from "../config/DatabaseConfig";
import AisMessageDaoFactory from "../daos/factory/AisMessageDaoFactory";

export default class AisMessageController {
    static getRecentShipPositions = async (response: ServerResponse) => {
        const aisMessageDao = await AisMessageDaoFactory.getAisMessageDao(DatabaseConfig.Config);
        const recentPositions = await aisMessageDao.findMostRecentShipPositions();

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(recentPositions));
    }
}

