import {VesselDao} from "../interface/VesselDao";
import Vessel from "../../models/Vessel";
import {Db, ObjectId} from "mongodb";
import DeleteException from "../exceptions/DeleteException";

export default class VesselDaoMongo implements VesselDao {

    private database: Db;
    private readonly collectionName = 'vessels';

    constructor(database: Db) {
        this.database = database;
    }

    async delete(id: string): Promise<void> {
        const deleteWriteOpResultObject = await this.database.collection(this.collectionName)
            .deleteOne({_id: new ObjectId(id)});
        if (deleteWriteOpResultObject.deletedCount === undefined) {
            throw new DeleteException("Delete Count was undefined");
        }
    }

    async find(id: string): Promise<Vessel> {
        const document = await this.database.collection(this.collectionName).findOne({_id: new ObjectId(id)});
        return Vessel.fromJson(JSON.stringify(document));
    }

    async findAll(): Promise<Vessel[]> {
        return Promise.resolve([]);
    }

    async insert(model: Vessel): Promise<Vessel> {
        const insertOneWriteOpResult = await this.database.collection(this.collectionName).insertOne(
            {
                IMO: model.imo,
                Name: model.name
            }
        );
        const document = await this.database.collection(this.collectionName).findOne({_id: insertOneWriteOpResult.insertedId});
        return Vessel.fromJson(document.toString());
    }

    async update(id: string, model: Vessel): Promise<Vessel> {
        const updateWriteOpResult = await this.database.collection(this.collectionName).updateOne({_id: new ObjectId(id)}, {
            IMO: model.imo,
            Name: model.name
        });
        const document = await this.database.collection(this.collectionName).findOne({_id: updateWriteOpResult.upsertedId});
        return Vessel.fromJson(document.toString());
    }

}
