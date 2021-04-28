import TileData from "./interfaces/TileData";

export default class MapHelpers {
    static getXPosition(longitude: number, tile: TileData): number {
        return (longitude - tile.image_west) / (tile.image_east - tile.image_west) * 100;
    }

    static getYPosition(latitude: number, tile: TileData): number {
        return (tile.image_north - latitude) / (tile.image_north - tile.image_south) * 100;
    }

    static calculateMapY (e: any, tile: TileData): number {
        let divTop, divHeight: number;

        divTop = document.getElementById('map')!.offsetTop;
        divHeight = document.getElementById('map')!.offsetHeight;

        return tile.south + (tile.north - tile.south) * (1 - ((e.pageY - divTop) / divHeight));
    }

    static calculateMapX (e: any, tile: TileData): number {
        let divLeft, divWidth: number;

        divLeft = document.getElementById('map')!.offsetLeft;
        divWidth = document.getElementById('map')!.offsetWidth;

        return tile.west + (tile.east - tile.west) * ((e.pageX - divLeft) / divWidth);
    }
}
