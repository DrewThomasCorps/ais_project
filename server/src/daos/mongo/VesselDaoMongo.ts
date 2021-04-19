import Vessel from "../../models/Vessel";
import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import CrudDao from "../interface/CrudDao";

export default class VesselDaoMongo extends DaoMongoCrud<Vessel> implements CrudDao<Vessel>  {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'vessels';
        this.mongoModel = Vessel.prototype;
    }

    toDocument(model: Vessel): object {
        return {
            IMO: model.imo,
            Flag: model.flag,
            Name: model.name,
            Built: model.built,
            Length: model.length,
            Breadth: model.breadth,
            Tonnage: model.tonnage,
            MMSI: model.mmsi,
            VesselType: model.vessel_type,
            Owner: model.owner,
            FormerNames: model.former_names
        }
    }

}
