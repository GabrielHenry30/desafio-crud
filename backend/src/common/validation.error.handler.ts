import { ExpressErrorMiddlewareInterface, Middleware, HttpError } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ValidationErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any) {
        if (error.name === 'badRequestError' && error.errors && Array.isArray(error.errors)) {
            return response.status(400).json({
                message: error.errors
            });
        }

        if (error.name === 'ConflictError') {
            return response.status(409).json({
                message: error.message
            });
        }

        if (error.name === 'NotFoundError') {
            return response.status(404).json({
                message: error.message
            });
        }

        if (error instanceof HttpError) {
            return response.status(error.httpCode).json({
                message: error.message
            });
        }

        return response.status(500).json({
            message: error.message || 'Internal server error'
        });
    }
}

