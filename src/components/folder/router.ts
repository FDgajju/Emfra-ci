import type { FastifyInstance } from 'fastify';
import { FolderController } from './Controller';
import { folderRouteSchemas } from './schema';

export async function folderRouter(fastify: FastifyInstance) {
    const controller = new FolderController();

    fastify.get('/', { schema: folderRouteSchemas.getAll }, controller.getAll);
    fastify.get('/:id', { schema: folderRouteSchemas.getById }, controller.getById);
    fastify.post('/', { schema: folderRouteSchemas.create }, controller.create);
    fastify.put('/:id', { schema: folderRouteSchemas.update }, controller.update);
    fastify.delete('/:id', { schema: folderRouteSchemas.delete }, controller.delete);
}
