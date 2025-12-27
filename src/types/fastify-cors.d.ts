declare module '@fastify/cors' {
    import type { FastifyPluginCallback } from 'fastify';

    export interface FastifyCorsOptions {
        origin?:
            | boolean
            | string
            | RegExp
            | Array<string | RegExp>
            | ((origin: string, callback: (error: Error | null, allow?: boolean) => void) => void);
        credentials?: boolean;
        exposedHeaders?: string | string[];
        allowedHeaders?: string | string[];
        methods?: string | string[];
        maxAge?: number;
        preflightContinue?: boolean;
        optionsSuccessStatus?: number;
        preflight?: boolean;
        strictPreflight?: boolean;
        hideOptionsRoute?: boolean;
    }

    const plugin: FastifyPluginCallback<FastifyCorsOptions>;
    export default plugin;
}
