import VesselDaoMongo from "../mongo/VesselDaoMongo";
import Mongo from "../databases/Mongo";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
import CrudDao from "../interface/CrudDao";
import Vessel from "../../models/Vessel";

export default class VesselDaoFactory {
    static async getVesselDao(databaseConfig: DatabaseConfig) : Promise<CrudDao<Vessel>>
    {
        switch (databaseConfig.type) {
            case 'mongo':
                return new VesselDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.type} is not a valid database type.`);
        }

    }
}
