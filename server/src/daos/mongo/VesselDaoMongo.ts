import Vessel from "../../models/Vessel";
import DaoMongoCrud from "./DaoMongoCrud";
import {Db, ObjectId} from "mongodb";
import CrudDao from "../interface/CrudDao";

export default class VesselDaoMongo extends DaoMongoCrud<Vessel> implements CrudDao<Vessel> {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'vessels';
        this.mongoModel = Vessel.prototype;
    }

    toDocument(model?: Vessel): object {
        if (model === undefined) {
            return {}
        }
        let document: any = {};
        if (model.imo) {
            document.IMO = model.imo;
        }
        if (model.flag) {
            document.Flag = model.flag
        }
        if (model.name) {
            document.Name = model.name
        }
        if (model.built) {
            document.Built = model.built
        }
        if (model.length) {
            document.Length = model.length
        }
        if (model.breadth) {
            document.Breadth = model.breadth
        }
        if (model.tonnage) {
            document.Tonnage = model.tonnage
        }
        if (model.mmsi) {
            document.MMSI = model.mmsi
        }
        if (model.vessel_type) {
            document.VesselType = model.vessel_type
        }
        if (model.owner) {
            document.Owner = model.owner
        }
        if (model.former_names) {
            document.FormerNames = model.former_names
        }
        return document;
    }

}
