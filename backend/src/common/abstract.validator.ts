import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { BadRequestError } from "routing-controllers";

export class ValidationBadRequestError extends BadRequestError {
    name = 'badRequestError';
    errors: string[];
    
    constructor(errors: string[]) {
        super('');
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationBadRequestError.prototype);
    }

    toJSON() {
        return {
            message: this.errors
        };
    }
}

export abstract class AbstractValidator {
    async validatePayload<T extends object>(
        payload: T,
        classType: new () => T,
    ): Promise<void> {
        const newPayload = plainToInstance(classType, payload);

        const validationErrors: Array<ValidationError> = await validate(
            newPayload,
            {
                forbidUnknownValues: false,
                validationError: {
                    target: false,
                    value: false,
                },
            },
        );

        if (validationErrors.length > 0) {
            const formattedErrors = this.formatErrors(validationErrors);
            throw new ValidationBadRequestError(formattedErrors);
        }
    }

    private formatErrors(
        errors: ValidationError[],
        errorMessages: string[] = [],
        parentField: string = '',
    ): string[] {
        errors.forEach(error => {
            let field = parentField
                ? `${parentField}.${error.property}`
                : error.property;

            if (/\.\d+\./.test(field)) {
                field = field.replace(/\.(\d+)\./g, '[$1].');
            }
            if (error.children && error.children.length) {
                this.formatErrors(error.children, errorMessages, field);
            } else if (error.constraints) {
                Object.values(error.constraints).forEach(constraintMessage => {
                    errorMessages.push(
                        constraintMessage.replace(error.property, field) || 'Invalid value',
                    );
                });
            }
        });

        return errorMessages;
    }
}

