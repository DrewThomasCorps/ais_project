import Model from "../../models/Model";

export default interface Dao {
    insert(model: Model): Promise<Model>;
    find(id: string): Promise<Model>;
    findAll(): Promise<Model[]>;
    delete(id: string): Promise<void>;
    update(id: string, model: Model): Promise<Model>;
}
