import Tile from "../../models/Tile";
import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import CrudDao from "../interface/CrudDao";
import * as fs from "fs";

/**
 * Creates Tile DAO for MongoDB. Includes specialized methods beyond basic CRUD to retrieve tile image files, find
 * contained tiles, and find tiles by coordinates.
 */
export default class TileDaoMongo extends DaoMongoCrud<Tile> implements CrudDao<Tile> {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'mapviews';
        this.mongoModel = Tile.prototype;
    }

    toDocument(model?: Tile): object {

        if (model === undefined) {
            return {}
        }

        let document: any = {};

        if (model.id) {
            document.id = model.id;
        }
        if (model.ICESName) {
            document.ICESName = model.ICESName;
        }
        if (model.west) {
            document.west = model.west;
        }
        if (model.south) {
            document.south = model.south;
        }
        if (model.east) {
            document.east = model.east;
        }
        if (model.north) {
            document.north = model.north;
        }
        if (model.scale) {
            document.scale = model.scale;
        }
        if (model.filename) {
            document.filename = model.filename;
        }
        if (model.image_width) {
            document.image_width = model.image_width;
        }
        if (model.image_height) {
            document.image_height = model.image_height;
        }
        if (model.image_west) {
            document.image_west = model.image_west;
        }
        if (model.image_east) {
            document.image_east = model.image_east;
        }
        if (model.image_north) {
            document.image_north = model.image_north;
        }
        if (model.image_south) {
            document.image_south = model.image_south;
        }
        if (model.contained_by) {
            document.contained_by = model.contained_by;
        }

        return document;
    }

    async insertTileImages() {
        let tileImageDirectory = './src/images/'
        let tileImages = fs.readdirSync(tileImageDirectory);

        tileImages.forEach( tileImage => {
            let binaryImage = fs.readFileSync(tileImageDirectory+tileImage).toString('binary');
            this.database.collection(this.collectionName).updateOne({filename: tileImage},{$set: {image_file: binaryImage}});
        });
    }

    /**
     * Queries database for tile image file by tile id.
     * @param tileId
     */
    async getTileImage(tileId: number) : Promise<Tile>
    {
        const image = await this.database.collection(this.collectionName).findOne({ id: tileId });

        // @ts-ignore
        // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
        return this.mongoModel.constructor.fromJson(JSON.stringify(image));
    }

    /**
     * Finds tiles that are contained in the given tile id. Excludes `image_file` binary from projection.
     * @param tileId
     */
    async findContainedTiles(tileId: number) {
        const tiles = await this.database.collection(this.collectionName).find({contained_by: tileId}, {projection: {image_file: 0}}).toArray();

        return tiles.map((tile: any) => {
            // @ts-ignore
            // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
            return this.mongoModel.constructor.fromJson(JSON.stringify(tile));
        });
    }

    /**
     * Finds tiles using given query object.
     * `const queryObject = {
     * image_west: {$lte: longitude},
     * image_east: {$gt: longitude},
     * image_north: {$gt: latitude},
     * image_south: {$lte: latitude},
     * scale: scale }`
     * @param queryObject
     */
    async findTilesByCoordinates(queryObject: object): Promise<Tile[]> {
        const tiles = await this.database.collection(this.collectionName).find(queryObject, {projection: {image_file: 0}}).toArray();

        return tiles.map((tile: any) => {
            // @ts-ignore
            // Cannot use reflection with typescript, so the ModelImpl prototype is used to call its static method.
            return this.mongoModel.constructor.fromJson(JSON.stringify(tile));
        });
    }

}
