import QueryBuilder from "./QueryBuilder";

import {URL} from "url";
import AisMessage from "../models/AisMessage";

/**
 * Constructs a QueryBuilder object from an AiSMessage that can be used to create a MongoDB query.
 */
export default class AisMessageQueryBuilder implements QueryBuilder<AisMessage> {
    private readonly mmsi: string | null;
    private readonly name: string | null;
    private readonly callSign: string | null;
    private readonly imo: string | null;


    constructor(requestUrl: URL) {
        this.mmsi = requestUrl.searchParams.get('mmsi');
        this.name = requestUrl.searchParams.get('name');
        this.callSign = requestUrl.searchParams.get('callSign');
        this.imo = requestUrl.searchParams.get('imo');
    }


    /**
     * Converts request search parameters to a JSON string that can be used to query MongoDB.
     * @returns jsonString contains keys and pairs used to query the port collection in MongoDB.
     */
    buildFilterModel() :AisMessage
    {
        let query: any = {};

        if (this.name !== null) {
            query["Name"] = this.name;
        }
        if (this.mmsi !== null) {
            query['MMSI'] = parseInt(this.mmsi, 10);
        }
        if (this.callSign !== null) {
            query['CallSign'] = this.callSign;
        }
        if (this.imo !== null) {
            query['IMO'] = parseInt(this.imo, 10);
        }
        return AisMessage.fromJson(JSON.stringify(query));
    }
}
