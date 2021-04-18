const { ObjectID } = require('mongodb');
import {URL} from "url";

export default class VesselQueryBuilder {
    private readonly imo: string | null;
    private readonly id: string | undefined;

    constructor(requestUrl: URL) {
        this.imo = requestUrl.searchParams.get('IMO');
        this.id = requestUrl.pathname.split('/')[2];
    }

    buildQuery() {
        let query: any = {};

        if (this.id !== undefined) {
            query["_id"] = new ObjectID(this.id);
        }

        if (this.imo !== null) {
            query["IMO"] = parseInt(this.imo,10);
        }

        return query;
    }
}
