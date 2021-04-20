import {Model} from "../models/Model";

export default interface QueryBuilder<T extends Model> {
    buildFilterModel(): T;
}
