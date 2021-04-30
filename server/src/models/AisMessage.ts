import {Model} from './Model';
import {Position} from "./Position";

/**
 * The abstract model for `ais_message` documents.
 */
export default class AisMessage implements Model {
    id: string | null = null;
    timestamp!: Date | null;
    shipClass!: string | null;
    mmsi!: number | null;
    messageType!: string | null;

    //Position Report Fields
    position: Position | null = null;
    status: string | null = null;
    rate_of_turn: number | null = null;
    speed_over_ground: number | null = null;
    course_over_ground: number | null = null;
    heading: number | null = null;

    //Static Data Fields
    imo: string | number | null = null;
    callSign: string | null = null;
    name: string | null = null;
    vesselType: string | null = null;
    length: number | null = null;
    breadth: number | null = null;
    draught: number | null = null;
    destination: string | null = null;
    eta: Date | null = null;
    a: number | null = null;
    b: number | null = null;
    c: number | null = null;
    d: number | null = null;

    public static fromJson(jsonString: string): AisMessage {
        const json = JSON.parse(jsonString)
        const builder = new this.Builder();

        return builder.setId(json['_id'] ?? null)
            .setTimestamp(json['Timestamp'] ? new Date(json['Timestamp']) : null)
            .setShipClass(json['Class'] ?? null)
            .setMmsi(json['MMSI'] ?? null)
            .setMessageType(json['MsgType'] ?? null)
            .setPosition(json['Position'] ?? null)
            .setStatus(json["Status"] ?? null)
            .setRateOfTurn(json['RoT'] ?? null)
            .setSpeedOverGround(json['SoG'] ?? null)
            .setCourseOverGround(json['CoG'] ?? null)
            .setHeading(json['Heading'] ?? null)
            .setImo(json["IMO"] ?? null)
            .setCallSign(json["CallSign"] ?? null)
            .setName(json['Name'] ?? null)
            .setVesselType(json['VesselType'] ?? null)
            .setLength(json['Length'] ?? null)
            .setBreadth(json['Breadth'] ?? null)
            .setDraught(json['Draught'] ?? null)
            .setDestination(json['Destination'] ?? null)
            .setEta(json['ETA'] ? new Date(json['ETA']) : null)
            .setA(json['A'] ?? null)
            .setB(json['B'] ?? null)
            .setC(json['C'] ?? null)
            .setD(json['D'] ?? null)
            .build();
    }


    static Builder = class {

        private aisMessage: AisMessage;

        constructor() {
            this.aisMessage = new AisMessage();
        }

        setId(id: string) {
            this.aisMessage.id = id;
            return this;
        }

        setTimestamp(timestamp: Date | null) {
            this.aisMessage.timestamp = timestamp;
            return this;
        }

        setShipClass(shipClass: string) {
            this.aisMessage.shipClass = shipClass;
            return this;
        }

        setMmsi(mmsi: number) {
            this.aisMessage.mmsi = mmsi;
            return this;
        }

        setMessageType(messageType: string) {
            this.aisMessage.messageType = messageType;
            return this;
        }

        setPosition(position: any) {
            this.aisMessage.position = position ? new Position(position['type'], position['coordinates']) : null;
            return this;
        }

        setStatus(status: string) {
            this.aisMessage.status = status;
            return this;
        }

        setRateOfTurn(rateOfTurn: number) {
            this.aisMessage.rate_of_turn = rateOfTurn;
            return this;
        }

        setSpeedOverGround(speedOverGround: number) {
            this.aisMessage.speed_over_ground = speedOverGround;
            return this;
        }

        setCourseOverGround(courseOverGround: number) {
            this.aisMessage.course_over_ground = courseOverGround;
            return this;
        }

        setHeading(heading: number) {
            this.aisMessage.heading = heading;
            return this;
        }

        setImo(imo: string) {
            this.aisMessage.imo = imo;
            return this;
        }

        setCallSign(callSign: string) {
            this.aisMessage.callSign = callSign;
            return this;
        }

        setName(name: string) {
            this.aisMessage.name = name;
            return this;
        }

        setVesselType(vesselType: string) {
            this.aisMessage.vesselType = vesselType;
            return this;
        }

        setLength(length: number) {
            this.aisMessage.length = length;
            return this;
        }

        setBreadth(breadth: number) {
            this.aisMessage.breadth = breadth;
            return this;
        }

        setDraught(draught: number) {
            this.aisMessage.draught = draught;
            return this;
        }

        setDestination(destination: string) {
            this.aisMessage.destination = destination;
            return this;
        }

        setEta(eta: Date | null) {
            this.aisMessage.eta = eta;
            return this;
        }

        setA(a: number) {
            this.aisMessage.a = a;
            return this;
        }

        setB(b: number) {
            this.aisMessage.b = b;
            return this;
        }

        setC(c: number) {
            this.aisMessage.c = c;
            return this;
        }

        setD(d: number) {
            this.aisMessage.d = d;
            return this;
        }


        build() {
            const port = this.aisMessage;
            this.aisMessage = new AisMessage();
            return port;
        }

    }

}
