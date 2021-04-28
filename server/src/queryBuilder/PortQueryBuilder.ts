import QueryBuilder from "./QueryBuilder";

import {URL} from "url";
import Port from "../models/Port";

/**
 * Constructs a QueryBuilder object from a Port that can be used to create a MongoDB query.
 */
export default class PortQueryBuilder implements QueryBuilder<Port>{
    private readonly name: string | null;
    private readonly country: string | null;
    private readonly mapview_1: string | null;
    private readonly mapview_2: string | null;
    private readonly mapview_3: string | null;

    constructor(requestUrl: URL) {
        this.name = requestUrl.searchParams.get('name');
        this.country = requestUrl.searchParams.get('country');
        this.mapview_1 = requestUrl.searchParams.get('mapview_1');
        this.mapview_2 = requestUrl.searchParams.get('mapview_2');
        this.mapview_3 = requestUrl.searchParams.get('mapview_3');
    }


    /**
     * Converts request search parameters to a JSON string that can be used to query MongoDB.
     * @returns jsonString contains keys and pairs used to query the port collection in MongoDB.
     */
    buildFilterModel() :Port
    {
        let query: any = {};
        if (this.name !== null) {
            query["port_location"] = this.name;
        }
        if (this.country !== null) {
            query['country'] = this.country;
        }
        if (this.mapview_1 !== null) {
            query['mapview_1'] = parseInt(this.mapview_1, 10);
        }
        if (this.mapview_2 !== null) {
            query['mapview_2'] = parseInt(this.mapview_2, 10);
        }
        if (this.mapview_3 !== null) {
            query['mapview_3'] = parseInt(this.mapview_3, 10);
        }
        return Port.fromJson(JSON.stringify(query));
    }
}
