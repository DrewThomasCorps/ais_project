import Position from "./Position";
import MapObject from "./MapObject";

interface VesselMapObject extends MapObject{
    Timestamp: object,
    Class: string,
    MMSI: number,
    MsgType: string,
    Position: Position,
    Status: string,
    SoG: number,
    CoG: number,
    RoT?: number,
    Heading: number
}

export default VesselMapObject;
