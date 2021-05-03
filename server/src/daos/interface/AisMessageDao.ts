import CrudDao from "./CrudDao";
import AisMessage from "../../models/AisMessage";

/**
 * Functions for obtaining and manipulating AisMessage Data.
 */
export default interface AisMessageDao extends CrudDao<AisMessage> {
    /**
     * Inserts a batch of AisMessages into the database.
     *
     * @param models to be created
     * @return Promise<number> of number of models inserted
     */
    insertBatch(models: AisMessage[]): Promise<number>

    /**
     * Finds the latest ship positions as reported in positions_reports.
     *
     * Returns array of documents in the following format:
     * ```
     * [{'MMSI': 1234567890, 'Timestamp': 2020-11-18T00:00:00.000Z, 'Position': {'type': 'Point', 'coordinates': [30, 20]}}]
     * ```
     *
     * @return Promise<any[]> of latest ship positions.
     */
    findMostRecentShipPositions(): Promise<any[]>

    /**
     * Finds the latest ship position for the ship with the given MMSI.
     *
     * Returns document in the following format:
     * ```
     * {'MMSI': 1234567890, 'Timestamp': '2020-11-18T00:00:00.000Z', 'lat': 30, 'long': 20, IMO: 103212331}
     * ```
     *
     * @param mmsi
     * @return Promise<any> of the last position for the given ship.
     */
    findMostRecentPositionForMmsi(mmsi: number): Promise<any>

    /**
     * Finds the latest ship positions as reported in positions_reports within the given tile.
     *
     * Returns array of documents in the following format:
     * ```
     * [{'MMSI': 1234567890, 'Timestamp': 2020-11-18T00:00:00.000Z, 'Position': {'type': 'Point', 'coordinates': [30, 20]}}]
     * ```
     *
     * @param tileId id of tile to find ship positions within.
     * @return Promise<any[]> of latest ship positions within given tile.
     */
    findMostRecentPositionsInTile(tileId: number): Promise<any[]>

    /**
     * Deletes all messages older than five minutes of given time.
     * If a message is exactly 5 minutes older, the message is not deleted.
     *
     * @param time that messages five minutes older than should be deleted.
     * @return Promise<number> of number of messages deleted
     */
    deleteMessagesFiveMinutesOlderThanTime(time: Date): Promise<number>

    /**
     * Finds a vessel's most recent static_data from ais_messages with vessel data from vessels, then
     * finds a vessel's most recent position_report and appends that to the data object.
     * @param filterModel
     */
    findStaticAndTransientData(filterModel: AisMessage): Promise<any>

    /**
     * Finds the most recent ship positions in tile of scall 3 containing the port specified. If the specified port matches multiple ports,
     * then each of the matched ports is returned.
     * @param portName
     * @param country
     */
    findAllShipPositionsInTileContainingPort(portName: string, country: string): Promise<any>
}
