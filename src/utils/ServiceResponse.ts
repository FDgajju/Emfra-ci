export interface ServiceResponse<T> {
    status: boolean;
    data: T;
    error?: Error | null;
}

export function createSuccessResponse<T>(data: T): ServiceResponse<T> {
    return {
        status: true,
        data,
        error: null,
    };
}

export function createErrorResponse<T>(error: Error, defaultData: T): ServiceResponse<T> {
    return {
        status: false,
        data: defaultData,
        error,
    };
}
