import Mongo from "../databases/Mongo";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import InvalidDatabaseConfigException from "../exceptions/InvalidDatabaseConfigException";
import AisMessageDaoMongo from "../mongo/AisMessageDaoMongo";
import AisMessageDao from "../interface/AisMessageDao";
import PortDao from "../interface/PortDao";
import PortDaoMongo from "../mongo/PortDaoMongo";
import TileDao from "../interface/TileDao";
import TileDaoMongo from "../mongo/TileDaoMongo";
import CrudDao from "../interface/CrudDao";
import Vessel from "../../models/Vessel";
import VesselDaoMongo from "../mongo/VesselDaoMongo";

/**
 * Factory for retrieving appropriate DAO instances.
 */
export default class DaoFactory {
    /**
     * Retrieves an `AisMessageDao` with the type specified in the database config.
     * @param databaseConfig
     * @return Promise<AisMessageDao> of `AisMessageDao` with the database type specified in the database config.
     */
    static async getAisMessageDao(databaseConfig: DatabaseConfig): Promise<AisMessageDao> {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new AisMessageDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type for ais messages.`);
        }
    }

    /**
     * Retrieves an `PortDao` with the type specified in the database config.
     * @param databaseConfig
     * @return Promise<PortDao> of `PortDao` with the database type specified in the database config.
     */
    static async getPortDao(databaseConfig: DatabaseConfig): Promise<PortDao> {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new PortDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type.`);
        }
    }

    /**
     * Retrieves an `TileDao` with the type specified in the database config.
     * @param databaseConfig
     * @return Promise<TileDao> of `TileDao` with the database type specified in the database config.
     */
    static async getTileDao(databaseConfig: DatabaseConfig): Promise<TileDao> {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new TileDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type.`);
        }
    }

    /**
     * Retrieves an `VesselDao` with the type specified in the database config.
     * @param databaseConfig
     * @return Promise<VesselDao> of `VesselDao` with the database type specified in the database config.
     */
    static async getVesselDao(databaseConfig: DatabaseConfig): Promise<CrudDao<Vessel>> {
        switch (databaseConfig.getType()) {
            case 'mongo':
                return new VesselDaoMongo(await Mongo.getDatabase(databaseConfig));
            default:
                throw new InvalidDatabaseConfigException(`${databaseConfig.getType()} is not a valid database type.`);
        }
    }
}
