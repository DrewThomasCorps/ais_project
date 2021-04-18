export default class InvalidDatabaseConfigException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidDatabaseConfigException";
    }
}
