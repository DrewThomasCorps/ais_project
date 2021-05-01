import {Db, MongoClient} from "mongodb";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import assert from "assert";

/**
 * Class for establishing and closing a database connection
 */
export default class Mongo {
    static database : Db;
    static client : MongoClient;

    /**
     * Retrieves an open database instance from the Mongo Client connection pool.
     * If the client is closed it will open it.
     *
     * @param databaseConfig
     * @return Promise<Db> of a connected Mongo database instance.
     */
    static async getDatabase(databaseConfig: DatabaseConfig)  : Promise<Db>
    {
        if (this.database === undefined || !this.client.isConnected()) {
            const url = databaseConfig.getUrl();
            assert(typeof url === 'string');
            this.client = new MongoClient(url, {useUnifiedTopology: true});
            const mongoClient = await this.client.connect();
            this.database = mongoClient.db(databaseConfig.getName());
        }
        return this.database;
    }

    /**
     * Closes the Mongo Client.
     */
    static async closeDatabase() : Promise<void>
    {
        await this.client.close();
    }

}
