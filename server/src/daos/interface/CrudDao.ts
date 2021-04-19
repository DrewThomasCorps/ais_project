import {Model} from "../../models/Model";

export default interface CrudDao<T> {
    insert(model: Model): Promise<T>;
    find(id: string): Promise<T>;
    findAll(): Promise<T[]>;
    delete(id: string): Promise<void>;
    update(id: string, model: T): Promise<T>;
}
