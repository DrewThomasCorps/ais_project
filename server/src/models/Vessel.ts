import Model from "./Model";

export default class Vessel implements Model{
    imo: number = 0;
    id: string | null = null;
    flag: string | null = null;
    name: string | null = null;
    built: number | null = null;
    length: number | null = null;
    breadth: number | null = null;
    tonnage: number | null = null;
    mmsi: number | null = null;
    vessel_type: string | null = null;
    owner: number | null = null;
    former_names: string[] | null = null;

    private constructor() {
    }

    public static fromJson(jsonString: string): Vessel {
        const json = JSON.parse(jsonString)
        const builder = new this.Builder();
        return builder.setImo(json["IMO"])
            .setFlag(json["Flag"] ?? null)
            .setName(json["Name"] ?? null)
            .setBuilt(json["Built"] ?? null)
            .setLength(json["Length"] ?? null)
            .setBreadth(json["Breadth"] ?? null)
            .setTonnage(json["Tonnage"] ?? null)
            .setMmsi(json["MMSI"] ?? null)
            .setVesselType(json["VesselType"] ?? null)
            .setOwner(json["Owner"] ?? null)
            .setFormerNames(json["FormerNames"] ?? null)
            .build();
    }

    private static Builder = class {

        private vessel: Vessel;

        constructor() {
            this.vessel = new Vessel();
        }

        setImo(imo: number) {
            this.vessel.imo = imo;
            return this;
        }

        setFlag(flag: string) {
            this.vessel.flag = flag;
            return this;
        }

        setName(name: string) {
            this.vessel.name = name;
            return this;
        }

        setBuilt(built: number) {
            this.vessel.built = built;
            return this;
        }

        setLength(length: number) {
            this.vessel.length = length;
            return this;
        }

        setBreadth(breadth: number) {
            this.vessel.breadth = breadth;
            return this;
        }

        setTonnage(tonnage: number) {
            this.vessel.tonnage = tonnage;
            return this;
        }

        setMmsi(mmsi: number) {
            this.vessel.mmsi = mmsi;
            return this;
        }

        setVesselType(vesselType: string) {
            this.vessel.vessel_type = vesselType;
            return this;
        }

        setOwner(owner: number) {
            this.vessel.owner = owner;
            return this;
        }

        setFormerNames(formerNames: string[]) {
            this.vessel.former_names = formerNames;
            return this;
        }

        build() {
            const vessel = this.vessel;
            this.vessel = new Vessel();
            return vessel;
        }

    }
}
