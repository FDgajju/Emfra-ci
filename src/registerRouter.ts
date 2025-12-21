import type { FastifyInstance } from 'fastify';
import { folderRouter } from './components/folder/router';
import { jobRouter } from './components/job/router';
import { credentialsRouter } from './components/credentials/router';

export async function registerRouters(fastify: FastifyInstance) {
    // Register component routers with prefixes
    await fastify.register(folderRouter, { prefix: '/api/folders' });
    await fastify.register(jobRouter, { prefix: '/api/jobs' });
    await fastify.register(credentialsRouter, { prefix: '/api/credentials' });

    // Project, Pipeline, and Run components do not have routers (Service + Repository only)
}
