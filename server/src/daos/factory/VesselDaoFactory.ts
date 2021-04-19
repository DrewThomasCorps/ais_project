import VesselDaoMongo from "../mongo/VesselDaoMongo";
import Mongo from "../databases/Mongo";
import {VesselDao} from "../interface/VesselDao";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
// import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";

export default class VesselDaoFactory {
    static async getVesselDao(databaseConfig: DatabaseConfig) : Promise<VesselDao>
    {
        switch (databaseConfig.type) {
            case 'mongo':
                return new VesselDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.type} is not a valid database type.`);
        }

    }
}
