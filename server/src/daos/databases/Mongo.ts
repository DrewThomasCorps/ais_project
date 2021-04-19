import {Db, MongoClient} from "mongodb";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import assert from "assert";

export default class Mongo {
    static database : Db;
    static client : MongoClient;

    static async getDatabase(databaseConfig: DatabaseConfig)  : Promise<Db>
    {
        if (this.database === undefined) {
            const url = databaseConfig.getUrl();
            assert(typeof url === 'string')
            this.client = new MongoClient(url, {useUnifiedTopology: true})
            const mongoClient = await this.client.connect();
            this.database = mongoClient.db(databaseConfig.getName())
        }
        return this.database;
    }

    static async closeDatabase() : Promise<void>
    {
        await this.client.close();
    }

}
