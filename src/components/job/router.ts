import type { FastifyInstance } from 'fastify';
import { JobController } from './Controller';
import { jobRouteSchemas } from './schema';

export async function jobRouter(fastify: FastifyInstance) {
    const controller = new JobController();

    fastify.get('/', { schema: jobRouteSchemas.getAll }, controller.getAll);
    fastify.get('/:id', { schema: jobRouteSchemas.getById }, controller.getById);
    fastify.post('/', { schema: jobRouteSchemas.create }, controller.create);
    fastify.put('/:id', { schema: jobRouteSchemas.update }, controller.update);
    fastify.delete('/:id', { schema: jobRouteSchemas.delete }, controller.delete);
}
