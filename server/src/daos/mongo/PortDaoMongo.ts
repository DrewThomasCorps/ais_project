import Port from "../../models/Port";
import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import CrudDao from "../interface/CrudDao";

export default class PortDaoMongo extends DaoMongoCrud<Port> implements CrudDao<Port> {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'ports';
        this.mongoModel = Port.prototype;
    }

    /**
     * Converts a `Port` model into  a document to be used by a Mongo Database.
     * @param model
     */
    toDocument(model?: Port): object {

        if (model === undefined) {
            return {}
        }

        let document: any = {};

        if (model.id) {
            document.id = model.id;
        }

        if (model.un_locode) {
            document.un_locode = model.un_locode;
        }

        if (model.port_location) {
            document.port_location = model.port_location;
        }

        if (model.country) {
            document.country = model.country;
        }

        if (model.longitude) {
            document.longitude = model.longitude;
        }

        if (model.latitude) {
            document.latitude = model.latitude;
        }

        if (model.website) {
            document.website = model.website;
        }

        if (model.mapview_1) {
            document.mapview_1 = model.mapview_1;
        }

        if (model.mapview_2) {
            document.mapview_2 = model.mapview_2;
        }

        if (model.mapview_3) {
            document.mapview_3 = model.mapview_3;
        }

        return document;
    }
}
