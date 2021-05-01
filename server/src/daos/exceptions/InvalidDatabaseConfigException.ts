/**
 * An exception for an invalid configuration is used to establish a database connection.
 */
export default class InvalidDatabaseConfigException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDatabaseConfigException";
    }
}
