import Vessel from "../../models/Vessel";
import CrudDao from "./CrudDao";

export interface VesselDao extends CrudDao {
    delete(id: string): Promise<void>;

    find(id: string): Promise<Vessel>;

    findAll(): Promise<Vessel[]>;

    insert(model: Vessel): Promise<Vessel>;

    update(id: string, model: Vessel): Promise<Vessel>;
}
