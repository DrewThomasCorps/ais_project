export interface DatabaseConfig {
    type: string;
    getName(): string | undefined;
    getUrl(): string | undefined;
}

export class DatabaseConfig  {
    static Mongo : DatabaseConfig = {
        type: 'mongo',
        getUrl() {
            return process.env['MONGO_DATABASE_URL']
        },
        getName() {
            return process.env['MONGO_DATABASE_NAME']
        }
    }
}
