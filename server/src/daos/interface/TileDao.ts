import CrudDao from "./CrudDao";
import Tile from "../../models/Tile";

/**
 * Functions for reading and manipulating `Tile`s.
 */
export default interface TileDao extends CrudDao<Tile> {
    /**
     * Returns `Tile` with given id.
     * @param tileId of tile to be searched for.
     * @return Promise<Tile> of tile searched for.
     */
    getTileImage(tileId: number): Promise<Tile>;

    /**
     * Finds the tiles contained within the given tile.
     * @param tileId
     * @return Promise<Tile[]> of tiles found within the given tile.
     */
    findContainedTiles(tileId: number): Promise<Tile[]>;

    /**
     * Finds tiles using given query object.
     * @return Promise<Tile[]>
     * @param latitude
     * @param longitude
     * @param scale
     */
    findTileByCoordinates(latitude: number, longitude: number, scale: number): Promise<Tile | null>;
}
