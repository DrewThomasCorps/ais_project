import QueryBuilder from "./QueryBuilder";

import {URL} from "url";
import Vessel from "../models/Vessel";

/**
 * Constructs a QueryBuilder object from a Vessel that can be used to create a MongoDB query.
 */
export default class VesselQueryBuilder implements QueryBuilder<Vessel>{
    private readonly imo: string | null;
    private readonly mmsi: string | null;
    private readonly flag: string | null;
    private readonly name: string | null;
    private readonly vesselType: string | null;
    private readonly built: string | null;
    private readonly length: string | null;
    private readonly breadth: string | null;
    private readonly tonnage: string | null;
    private readonly owner: string | null;

    constructor(requestUrl: URL) {
        this.imo = requestUrl.searchParams.get('imo');
        this.mmsi = requestUrl.searchParams.get('mmsi');
        this.flag = requestUrl.searchParams.get('flag');
        this.name = requestUrl.searchParams.get('name');
        this.built = requestUrl.searchParams.get('built');
        this.length = requestUrl.searchParams.get('length');
        this.breadth = requestUrl.searchParams.get('breadth');
        this.tonnage = requestUrl.searchParams.get('tonnage');
        this.vesselType = requestUrl.searchParams.get('vessel-type');
        this.owner = requestUrl.searchParams.get('owner')
    }

    /**
     * Converts request search parameters to a JSON string that can be used to query MongoDB.
     * @returns jsonString contains keys and pairs used to query the vessel collection in MongoDB.
     */
    buildFilterModel() :Vessel
    {
        let query: any = {};
        if (this.imo !== null) {
            query["IMO"] = parseInt(this.imo,10);
        }
        if (this.mmsi !== null) {
            query['MMSI'] = parseInt(this.mmsi, 10);
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
            query["VesselType"] = this.vesselType;
        }
        if (this.owner !== null) {
            query['Owner'] = parseInt(this.owner);
        }
        return Vessel.fromJson(JSON.stringify(query));
    }
}
