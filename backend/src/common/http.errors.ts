import { HttpError } from 'routing-controllers';

export class ConflictError extends HttpError {
    name = 'ConflictError';
    
    constructor(message: string) {
        super(409, message);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }

    toJSON() {
        return {
            message: this.message
        };
    }
}

