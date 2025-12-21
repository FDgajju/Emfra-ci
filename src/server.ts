import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { env } from './constants/env';
import { errorHandler } from './middlewares/errorHandler';
import { registerRouters } from './registerRouter';
import { initializeDirectories } from './config/initDirectories';

async function startServer() {
    // Initialize required directories
    initializeDirectories(env.dataPath, env.workspacePath);
    const fastify = Fastify({
        logger: {
            level: env.nodeEnv === 'development' ? 'info' : 'warn',
        },
    });

    // Register CORS
    await fastify.register(cors, {
        origin: true,
    });

    // Register multipart for file uploads
    await fastify.register(multipart, {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB max
        },
    });

    // Register error handler
    fastify.setErrorHandler(errorHandler);

    // Register all component routers
    await registerRouters(fastify);

    // Health check endpoint
    fastify.get('/health', async (_request, reply) => {
        return reply.status(200).send({
            success: true,
            message: 'EmfraCI Backend is running',
            timestamp: new Date().toISOString(),
        });
    });

    try {
        await fastify.listen({
            port: env.port,
            host: '0.0.0.0',
        });
        console.log(`🚀 Server is running on http://localhost:${env.port}`);
        console.log(`📊 Health check: http://localhost:${env.port}/health`);
        console.log(`📁 API Base: http://localhost:${env.port}/api`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

startServer();
