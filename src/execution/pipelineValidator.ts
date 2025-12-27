import { readFile } from 'node:fs/promises';
import yml from 'js-yaml';
import { Pipeline } from './types';
import { CredentialsRepository } from '../components/credentials/Repository';

export class PipelineValidator {
    private credentialsRepository: CredentialsRepository;

    constructor() {
        this.credentialsRepository = new CredentialsRepository();
    }

    async validateAndParsePipeline(path: string) {
        try {
            const pipeline = await readFile(path, 'utf-8');

            const ymlWithoutComments = pipeline.replace(/#.*/g, '');

            const envVars = this.extractEnvs(ymlWithoutComments);

            const parsedPipeline = yml.load(pipeline);

            await this.velidatePipelineSchema(parsedPipeline as Pipeline);

            await this.validateCredentials(envVars, parsedPipeline as Pipeline);

            return parsedPipeline as Pipeline;
        } catch (error) {
            console.error(error);
            throw new Error(error as string);
        }
    }

    async velidatePipelineSchema(pipeline: Pipeline) {
        if (!pipeline.version) {
            throw new Error('Pipeline version is must!');
        }

        if (!pipeline.stages && !Array.isArray(pipeline.stages)) {
            throw new Error('Pipeline must have stages!');
        }

        if (pipeline.stages.length === 0) {
            throw new Error('Pipeline must have at least one stage!');
        }

        for (const stage of pipeline.stages) {
            if (!stage.name) {
                throw new Error('Each stage must have a name');
            }

            if (!stage.run && !stage.sshPut && !stage.sshCommand) {
                throw new Error(`Stage "${stage.name}" must have at least one action`);
            }
        }
    }

    async validateCredentials(env: { envVars: string[]; secrets: string[] }, pipeline: Pipeline) {
        const credentials = await this.credentialsRepository.getAll();
        const envsNotFound = env.envVars.filter(
            (env) => !pipeline.env[env] || pipeline.env[env] === '',
        );
        const secretsNotFound = env.secrets.filter(
            (secret) => !credentials.find((c) => c.identifier === secret),
        );

        if (envsNotFound.length > 0) {
            throw new Error(
                `Environment variables ${envsNotFound.join(', ')} are not defined in the pipeline`,
            );
        }

        if (secretsNotFound.length > 0) {
            throw new Error(
                `Secrets identifier ${secretsNotFound.join(', ')} are not defined in the CI Configuration.`,
            );
        }

        return { envsNotFound, secretsNotFound };
    }

    extractEnvs(pipelineString: string) {
        return {
            envVars: [...new Set([...pipelineString.matchAll(/\$\{(\w+)\}/g)].map((m) => m[1]))],
            secrets: [...new Set([...pipelineString.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))],
        };
    }

    extractSecrets(pipelineString: string) {
        return [...new Set([...pipelineString.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))];
    }
}

export const pipelineValidator = new PipelineValidator();
