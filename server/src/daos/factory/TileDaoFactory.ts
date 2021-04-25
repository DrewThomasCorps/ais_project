import TileDaoMongo from "../mongo/TileDaoMongo";
import Mongo from "../databases/Mongo";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
// import Tile from "../../models/Tile";
import TileDao from "../interface/TileDao";

export default class TileDaoFactory {
    // @ts-ignore
    static async getTileDao(databaseConfig: DatabaseConfig): Promise<TileDao>
    {
        switch (databaseConfig.type) {
            case 'mongo':
                return new TileDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.type} is not a valid database type.`);
        }

    }
}
