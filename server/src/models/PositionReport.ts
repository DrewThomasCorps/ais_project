import AisMessage from "./AisMessage";
import {Position} from "./Position";

/**
 * The model for `position_report` documents. Includes class variables, an override for `fromJson`, and a `build` method.
 */
export default class PositionReport extends AisMessage {
    position!: Position;
    status!: string;
    rate_of_turn!: number;
    speed_over_ground!: number;
    course_over_ground!: number;
    heading!: number;

    constructor() {
        super();
    }

    public static async fromJson(jsonString: string): Promise<PositionReport> {
        const json = JSON.parse(jsonString)
        const builder = new this.Builder();

        return builder.setAisData(jsonString)
            .setPosition(json['Position'])
            .setStatus(json["Status"])
            .setRateOfTurn(json['RoT'])
            .setSpeedOverGround(json['SoG'])
            .setCourseOverGround(json['CoG'])
            .setHeading(json['Heading'])
            .build();
    }


    static Builder = class {

        private positionReport: PositionReport;

        constructor() {
            this.positionReport = new PositionReport();
        }

        setAisData(jsonString: string) {
            this.positionReport.setAisData(jsonString)
            return this;
        }

        setPosition(position: any) {
            this.positionReport.position = new Position(position['type'], position['coordinates'])
            return this;
        }

        setStatus(status: string) {
            this.positionReport.status = status;
            return this;
        }

        setRateOfTurn(rateOfTurn: number) {
            this.positionReport.rate_of_turn = rateOfTurn;
            return this;
        }

        setSpeedOverGround(speedOverGround: number) {
            this.positionReport.speed_over_ground = speedOverGround;
            return this;
        }

        setCourseOverGround(courseOverGround: number) {
            this.positionReport.course_over_ground = courseOverGround;
            return this;
        }

        setHeading(heading: number) {
            this.positionReport.heading = heading;
            return this;
        }

        build() {
            const port = this.positionReport;
            this.positionReport = new PositionReport();
            return port;
        }

    }
}
