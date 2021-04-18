import Vessel from "../../models/Vessel";
import Dao from "./Dao";

export interface VesselDao extends Dao {
    delete(id: string): Promise<void>;

    find(id: string): Promise<Vessel>;

    findAll(): Promise<Vessel[]>;

    insert(model: Vessel): Promise<Vessel>;

    update(id: string, model: Vessel): Promise<Vessel>;
}
