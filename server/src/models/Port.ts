import {Model} from './Model';

/**
 * The model for `port` documents. Includes class variables, an override for `fromJson`, and a `build` method.
 */
export default class Port implements Model {
    id: number = 0;
    un_locode: string | null = null;
    port_location: string | null = null;
    country: string | null = null;
    longitude: number = 0;
    latitude: number = 0;
    website: string | null = null;
    mapview_1: number = 0;
    mapview_2: number = 0;
    mapview_3: number = 0;

    private constructor() {}

    public static fromJson(jsonString: string): Port {
        const json = JSON.parse(jsonString)
        const builder = new this.Builder();

        return builder.setId(json["id"] ?? null)
            .setUnLocode(json["un/locode"]  ?? null)
            .setPortLocation(json["port_location"] ?? null)
            .setCountry(json["country"] ?? null)
            .setLongitude(json["longitude"] ?? null)
            .setLatitude(json["latitude"] ?? null)
            .setWebsite(json["website"] ?? null)
            .setMapView1(json["mapview_1"] ?? null)
            .setMapView2(json["mapview_2"] ?? null)
            .setMapView3(json["mapview_3"] ?? null)
            .build();
    }

    private static Builder = class {

        private port: Port;

        constructor() {
            this.port = new Port();
        }

        setId(id: string) {
            this.port.id = parseInt(id, 10);
            return this;
        }

        setUnLocode(un_locode: string) {
            this.port.un_locode = un_locode;
            return this;
        }

        setPortLocation(port_location: string) {
            this.port.port_location = port_location;
            return this;
        }

        setCountry(country: string) {
            this.port.country = country;
            return this;
        }

        setLongitude(longitude: string) {
            this.port.longitude = parseFloat(longitude);
            return this;
        }

        setLatitude(latitude: string) {
            this.port.latitude = parseFloat(latitude);
            return this;
        }

        setWebsite(website: string) {
            this.port.website = website;
            return this;
        }

        setMapView1(mapview_1: number) {
            this.port.mapview_1 = mapview_1;
            return this;
        }

        setMapView2(mapview_2: number) {
            this.port.mapview_2 = mapview_2;
            return this;
        }

        setMapView3(mapview_3: number) {
            this.port.mapview_3 = mapview_3;
            return this;
        }

        build() {
            const port = this.port;
            this.port = new Port();
            return port;
        }

    }
}
