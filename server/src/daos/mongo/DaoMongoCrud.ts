import {Db, ObjectId} from "mongodb";
import {Model} from "../../models/Model";
import CrudDao from "../interface/CrudDao";

/**
 * Abstract Mongo implementation of the CrudDao
 */
export default abstract class DaoMongoCrud<T extends Model> implements CrudDao<T>{
    protected database: Db;
    protected collectionName!: string;
    protected mongoModel!: Model;

    /**
     * @param database to be connected to.
     */
    protected constructor(database: Db) {
        this.database = database;
    }

    /**
     * Deletes model in database with the given id.
     *
     * @param id of model to be deleted.
     */
    async delete(id: string): Promise<void> {
        await this.database.collection(this.collectionName).deleteOne({_id: new ObjectId(id)});
    }

    /**
     * Finds the model with the given ID in the database.
     * @param id of model to find.
     * @return Promise<T> of found model.
     */
    async find(id: string): Promise<T> {
        const document = await this.database.collection(this.collectionName).findOne({_id: new ObjectId(id)});

        // @ts-ignore
        // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
        return this.mongoModel.constructor.fromJson(JSON.stringify(document));
    }

    /**
     * Finds all models in the database with the optional filter applied.
     *
     * If a filter model is passed, only records that have the set attributes will be returned.
     * @param filterModel
     * @return Promise<T[]> of array of models found in database with the filter applied.
     */
    async findAll(filterModel?: T): Promise<T[]> {
        const documents = await this.database.collection(this.collectionName).find(this.toDocument(filterModel)).toArray();

        return documents.map((document: any) => {
            // @ts-ignore
            // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
            return this.mongoModel.constructor.fromJson(JSON.stringify(document));
        });
    }

    /**
     * Inserts a model into a database.
     * @param model to be inserted.
     * @return Promise<T> of inserted model.
     */
    async insert(model: T): Promise<T> {
        const insertOneWriteOpResult = await this.database.collection(this.collectionName).insertOne(this.toDocument(model));
        return await this.find(insertOneWriteOpResult.insertedId)
    }

    /**
     * Updates model with given id in the database to match the model passed.
     *
     * Only the attributes set in the passed model will be updated.
     *
     * @param id of model to update.
     * @param model to be updated to.
     * @return Promise<T> of updated model.
     */
    async update(id: string, model: T): Promise<T> {
        await this.database.collection(this.collectionName).updateOne({_id: new ObjectId(id)},
            {$set: this.toDocument(model)}
        );
        return await this.find(id);
    }

    /**
     * Converts the model to a document for the Mongo database.
     * @param model
     */
    abstract toDocument(model?: T): object;

}

