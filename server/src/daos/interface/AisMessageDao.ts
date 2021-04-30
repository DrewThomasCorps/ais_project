import CrudDao from "./CrudDao";
import AisMessage from "../../models/AisMessage";

export default interface AisMessageDao extends CrudDao<AisMessage> {
    insertBatch(models: AisMessage[]): Promise<number>
    findMostRecentShipPositions(): Promise<any[]>
}
