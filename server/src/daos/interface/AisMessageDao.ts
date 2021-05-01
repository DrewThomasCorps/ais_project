import CrudDao from "./CrudDao";
import AisMessage from "../../models/AisMessage";

export default interface AisMessageDao extends CrudDao<AisMessage> {
    insertBatch(models: AisMessage[]): Promise<number>
    findMostRecentShipPositions(): Promise<any[]>
    findMostRecentPositionForMmsi(mmsi: number): Promise<any>
    findMostRecentPositionsInTile(tileId: number): Promise<any[]>
    deleteMessagesFiveMinutesOlderThanTime(time: Date): Promise<number>
}
