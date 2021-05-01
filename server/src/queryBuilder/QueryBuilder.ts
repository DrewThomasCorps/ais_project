import {Model} from "../models/Model";

/**
 * Class to parse query strings into specific Models
 */
export default interface QueryBuilder<T extends Model> {
    /**
     * @return T with attributes specified in the query string.
     */
    buildFilterModel(): T;
}
