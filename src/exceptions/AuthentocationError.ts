class AuthenticationError extends Error {
    public errorCode: number;

    constructor(errorCode: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.errorCode = errorCode;
    }
}

export default AuthenticationError;
