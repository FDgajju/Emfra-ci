import type { FastifyReply, FastifyRequest } from 'fastify';

export function CatchHandler(
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
): any {
    const original = descriptor.value;
    if (!original) return;

    descriptor.get = function (this: any) {
        // `this` is the controller instance here
        const controller = this;

        const wrapped = async function (req: FastifyRequest, reply: FastifyReply) {
            try {
                return await original.call(controller, req, reply);
            } catch (err) {
                // Let the global error handler handle it
                throw err;
            }
        };

        // Cache the wrapped handler on the instance
        Object.defineProperty(controller, propertyKey, {
            value: wrapped,
            configurable: true,
            writable: true,
        });

        return wrapped;
    };

    delete descriptor.value;
    delete descriptor.writable;
}
