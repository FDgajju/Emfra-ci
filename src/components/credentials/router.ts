import type { FastifyInstance } from 'fastify';
import { CredentialsController } from './Controller';
import { credentialsRouteSchemas } from './schema';

export async function credentialsRouter(fastify: FastifyInstance) {
    const controller = new CredentialsController();

    fastify.get('/', { schema: credentialsRouteSchemas.getAll }, controller.getAll);
    fastify.get('/:id', { schema: credentialsRouteSchemas.getById }, controller.getById);
    fastify.post('/', { schema: credentialsRouteSchemas.create }, controller.create);
    fastify.put('/:id', { schema: credentialsRouteSchemas.update }, controller.update);
    fastify.delete('/:id', { schema: credentialsRouteSchemas.delete }, controller.delete);
}
