import Vessel from "../../models/Vessel";
import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import CrudDao from "../interface/CrudDao";
import AisMessage from "../../models/AisMessage";
import PositionReport from "../../models/PositionReport";

export default class AisMessageDaoMongo extends DaoMongoCrud<AisMessage> implements CrudDao<AisMessage> {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'vessels';
        this.mongoModel = Vessel.prototype;
    }

    toDocument(model?: PositionReport): object {
        if (model === undefined) {
            return {};
        }

        let document: any = {};

        document.Timestamp = model.timestamp;
        document.Class = model.class;
        document.MMSI = model.mmsi;

        if (model.position) {
            document.Position = {type: model.position.type, coordinates: [model.position.latitude, model.position.longitude]};
        }
        if (model.status) {
            document.Status = model.status;
        }
        if (model.rate_of_turn) {
            document.RoT = model.rate_of_turn;
        }
        if (model.speed_over_ground) {
            document.SoG = model.speed_over_ground;
        }
        if (model.course_over_ground) {
            document.CoG = model.course_over_ground;
        }
        if (model.heading) {
            document.Heading = model.heading;
        }
        return document;
    }

}
