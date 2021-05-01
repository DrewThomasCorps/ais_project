import CrudDao from "./CrudDao";
import Tile from "../../models/Tile";

export default interface TileDao extends CrudDao<Tile> {
    getTileImage(tileId: number): Promise<Tile>;
    findContainedTiles(tileId: number): Promise<any>;
    findTileByCoordinates(latitude: number, longitude: number, scale: number): Promise<Tile | null>;
}
