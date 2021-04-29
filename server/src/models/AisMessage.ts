import {Model} from './Model';
import Vessel from "./Vessel";

/**
 * The abstract model for `ais_message` documents.
 */
export default abstract class AisMessage implements Model {
    id: string | null = null;
    timestamp!: Date;
    class!: string;
    mmsi!: number;
    vessel: Vessel | null = null;

    setAisData(jsonString: string) {
        const json = JSON.parse(jsonString)
        this.id = json['_id'];
        this.timestamp = new Date(json['Timestamp']);
        this.class = json['Class'];
        this.mmsi = json['MMSI'];
    }

}
