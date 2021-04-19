import {Db, ObjectId} from "mongodb";
import {Model} from "../../models/Model";

export default abstract class DaoMongoCrud<T extends Model> {
    private database: Db;
    protected collectionName!: string;
    protected mongoModel!: Model;

    constructor(database: Db) {
        this.database = database;
    }

    async delete(id: string): Promise<void> {
        await this.database.collection(this.collectionName).deleteOne({_id: new ObjectId(id)});
    }

    async find(id: string): Promise<T> {
        const document = await this.database.collection(this.collectionName).findOne({_id: new ObjectId(id)});
        // @ts-ignore
        // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
        return this.mongoModel.constructor.fromJson(JSON.stringify(document));
    }

    async findAll(): Promise<T[]> {
        const documents = await this.database.collection(this.collectionName).find().toArray();
        return documents.map((document: any) => {
            // @ts-ignore
            // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
            return this.mongoModel.constructor.fromJson(JSON.stringify(document));
        });
    }

    async insert(model: T): Promise<T> {
        const insertOneWriteOpResult = await this.database.collection(this.collectionName).insertOne(this.toDocument(model));
        return await this.find(insertOneWriteOpResult.insertedId)
    }

    async update(id: string, model: T): Promise<T> {
        await this.database.collection(this.collectionName).updateOne({_id: new ObjectId(id)},
            {$set: this.toDocument(model)}
        );
        return await this.find(id);
    }

    abstract toDocument(_model: T): object;

}

