import MapObject from "./MapObject";

interface PortMapObject extends MapObject {
    port_location: string,
    longitude: number,
    latitude: number
}

export default PortMapObject;
