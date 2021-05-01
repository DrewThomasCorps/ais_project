import {Model} from "../../models/Model";

/**
 * Functions for Create, Read, Update, and Delete operations for models.
 */
export default interface CrudDao<T extends Model> {
    /**
     * Inserts a model into a database.
     * @param model to be inserted.
     * @return Promise<T> of inserted model.
     */
    insert(model: T): Promise<T>;

    /**
     * Finds the model with the given ID in the database.
     * @param id of model to find.
     * @return Promise<T> of found model.
     */
    find(id: string): Promise<T>;

    /**
     * Finds all models in the database with the optional filter applied.
     *
     * If a filter model is passed, only records that have the set attributes will be returned.
     * @param filterModel
     * @return Promise<T[]> of array of models found in database with the filter applied.
     */
    findAll(filterModel?: T): Promise<T[]>;

    /**
     * Deletes model in database with the given id.
     *
     * @param id of model to be deleted.
     */
    delete(id: string): Promise<void>;

    /**
     * Updates model with given id in the database to match the model passed.
     *
     * Only the attributes set in the passed model will be updated.
     *
     * @param id of model to update.
     * @param model to be updated to.
     * @return Promise<T> of updated model.
     */
    update(id: string, model: T): Promise<T>;
}
