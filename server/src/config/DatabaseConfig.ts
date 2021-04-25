export interface DatabaseConfig {
    getType(): string | undefined;
    getName(): string | undefined;
    getUrl(): string | undefined;
}

export class DatabaseConfig  {
    static Config : DatabaseConfig = {
        getType() {
            return process.env['DATABASE_TYPE']
        },
        getUrl() {
            return process.env['DATABASE_URL']
        },
        getName() {
            return process.env['DATABASE_NAME']
        }
    }
}
