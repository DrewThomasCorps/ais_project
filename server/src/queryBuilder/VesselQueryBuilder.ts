import QueryBuilder from "./QueryBuilder";

const { ObjectID } = require('mongodb');
import {URL} from "url";
import Vessel from "../models/Vessel";

export default // @ts-ignore
class VesselQueryBuilder implements QueryBuilder<Vessel>{
    private readonly imo: string | null;
    private readonly id: string | undefined;
    private readonly flag: string | null;
    private readonly name: string | null;
    private readonly vesselType: string | null;
    private readonly built: string | null;
    private readonly length: string | null;
    private readonly breadth: string | null;
    private readonly tonnage: string | null;

    constructor(requestUrl: URL) {
        this.id = requestUrl.pathname.split('/')[2];
        this.imo = requestUrl.searchParams.get('imo');
        this.flag = requestUrl.searchParams.get('flag');
        this.name = requestUrl.searchParams.get('name');
        this.built = requestUrl.searchParams.get('built');
        this.length = requestUrl.searchParams.get('length');
        this.breadth = requestUrl.searchParams.get('breadth');
        this.tonnage = requestUrl.searchParams.get('tonnage');
        this.vesselType = requestUrl.searchParams.get('vessel-type');
    }

    buildQuery() {
        let query: any = {};

        if (this.id !== undefined) {
            query["_id"] = new ObjectID(this.id);
        }

        if (this.imo !== null) {
            query["IMO"] = parseInt(this.imo,10);
        }

        if (this.built !== null) {
            query["Built"] = parseInt(this.built,10);
        }

        if (this.length !== null) {
            query["Length"] = parseInt(this.length,10);
        }

        if (this.breadth !== null) {
            query["Breadth"] = parseInt(this.breadth,10);
        }

        if (this.tonnage !== null) {
            query["Tonnage"] = parseInt(this.tonnage,10);
        }

        if (this.flag !== null) {
            query["Flag"] = this.flag;
        }

        if (this.name !== null) {
            query["Name"] = this.name;
        }

        if (this.vesselType !== null) {
            query["vesselType"] = this.vesselType;
        }

        return query;
    }
}
