/**
 * Class used to specify how a database should be configured.
 */
export interface DatabaseConfig {
    getType(): string | undefined;
    getName(): string | undefined;
    getUrl(): string | undefined;
}

/**
 * Class for retrieving `DatabaseConfig` instances.
 */
export class DatabaseConfig  {
    /**
     * @return DatabaseConfig that uses environment variables for its Type, Url, and Name
     */
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
