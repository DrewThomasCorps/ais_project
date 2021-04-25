import TileDaoMongo from "../mongo/TileDaoMongo";
import Mongo from "../databases/Mongo";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
import TileDao from "../interface/TileDao";

export default class TileDaoFactory {
    static async getTileDao(databaseConfig: DatabaseConfig): Promise<TileDao>
    {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new TileDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type.`);
        }

    }
}
