interface TileData {
    id: number,
    ICESName: string,
    west: number,
    south: number,
    east: number,
    north: number,
    scale: number,
    filename: string,
    image_width: number,
    image_height: number,
    image_west: number,
    image_south: number,
    image_east: number,
    image_north: number,
    contained_by: number
}

export default TileData;
