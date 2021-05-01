import TileData from "./interfaces/TileData";

export default class MapHelpers {
    /**
     * Calculates the x position of a node within the 100x100 viewbox.
     * @param longitude
     * @param tile
     */
    static getXPosition(longitude: number, tile: TileData): number {
        return (longitude - tile.image_west) / (tile.image_east - tile.image_west) * 100;
    }

    /**
     * Calculates the y position of a node within the 100x100 viewbox.
     * @param latitude
     * @param tile
     */
    static getYPosition(latitude: number, tile: TileData): number {
        return (tile.image_north - latitude) / (tile.image_north - tile.image_south) * 100;
    }

    /**
     * Dynamically calculates the y coordinate of a mouseclick based on the current map size.
     * @param e
     * @param tile
     */
    static calculateMapY (e: any, tile: TileData): number {
        let divTop, divHeight: number;

        divTop = document.getElementById('map')!.offsetTop;
        divHeight = document.getElementById('map')!.offsetHeight;

        return tile.south + (tile.north - tile.south) * (1 - ((e.pageY - divTop) / divHeight));
    }

    /**
     * Dynamically calculates the x coordinate of a mouseclick based on the current map size.
     * @param e
     * @param tile
     */
    static calculateMapX (e: any, tile: TileData): number {
        let divLeft, divWidth: number;

        divLeft = document.getElementById('map')!.offsetLeft;
        divWidth = document.getElementById('map')!.offsetWidth;

        return tile.west + (tile.east - tile.west) * ((e.pageX - divLeft) / divWidth);
    }

    /**
     * Evaluates the x position of a node within the current map view.
     * @param xPosition
     */
    static evaluateXPosition = (xPosition: number):boolean => {
        let returnValue: boolean;

        returnValue = xPosition >= 0 && xPosition <= 100;

        return returnValue;
    }

    /**
     * Evaluates the y position of a node within the current map view.
     * @param yPosition
     */
    static evaluateYPosition = (yPosition: number):boolean => {
        let returnValue: boolean;

        returnValue = yPosition >= 0 && yPosition <= 100;

        return returnValue;
    }

}
