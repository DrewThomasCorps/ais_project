import Mongo from "../databases/Mongo";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
import AisMessageDaoMongo from "../mongo/AisMessageDaoMongo";
import AisMessageDao from "../interface/AisMessageDao";

/**
 * Retrieves the appropriate DAO for environment database type.
 */
export default class AisMessageDaoFactory {
    static async getAisMessageDao(databaseConfig: DatabaseConfig): Promise<AisMessageDao> {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new AisMessageDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type.`);
        }

    }
}
