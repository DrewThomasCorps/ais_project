import {Model} from "../../models/Model";

export default interface CrudDao<T extends Model> {
    insert(model: T): Promise<T>;
    find(id: string): Promise<T>;
    findAll(queryBuilder: any): Promise<T[]>;
    delete(id: string): Promise<void>;
    update(id: string, model: T): Promise<T>;
}
