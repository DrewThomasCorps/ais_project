export default class DeleteException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DeleteException";
    }
}
