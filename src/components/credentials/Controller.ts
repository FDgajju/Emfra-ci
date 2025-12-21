import type { FastifyReply, FastifyRequest } from 'fastify';
import { CredentialsService } from './Service';
import type { Credentials, UpdateCredentialsDto } from './schema';
import { CatchHandler } from '../../decorators/CatchHandler';
import { HTTP_STATUS } from '../../constants/httpStatus';
import type { MultipartFile } from '@fastify/multipart';
import type { CredentialType } from '../../constants/constants';

export class CredentialsController {
    private service: CredentialsService;

    constructor() {
        this.service = new CredentialsService();
    }

    @CatchHandler
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        // Extract query parameters as filter
        const filter = request.query as Partial<Omit<Credentials, 'createdAt' | 'updatedAt'>>;
        const response = await this.service.getAllCredentials(filter);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.OK).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = request.params;
        const response = await this.service.getCredentialsById(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.OK).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async create(request: FastifyRequest, reply: FastifyReply) {
        // Parse multipart form data
        const parts = request.parts();

        let identifier: string | undefined;
        let type: CredentialType | undefined;
        let username: string | undefined;
        let value: string | undefined;
        let file: MultipartFile | undefined;

        for await (const part of parts) {
            if (part.type === 'file') {
                file = part as MultipartFile;
            } else {
                // Field
                const fieldValue = (part.value as string).toString();
                switch (part.fieldname) {
                    case 'identifier':
                        identifier = fieldValue;
                        break;
                    case 'type':
                        type = fieldValue as CredentialType;
                        break;
                    case 'username':
                        username = fieldValue;
                        break;
                    case 'value':
                        value = fieldValue;
                        break;
                }
            }
        }

        if (!identifier || !type) {
            return reply.status(HTTP_STATUS.BAD_REQUEST).send({
                success: false,
                message: 'identifier and type are required fields',
            });
        }

        const response = await this.service.createCredentials({
            identifier,
            type,
            username,
            value,
            file,
        });

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.CREATED).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async update(
        request: FastifyRequest<{ Params: { id: string }; Body: UpdateCredentialsDto }>,
        reply: FastifyReply,
    ) {
        const { id } = request.params;
        const response = await this.service.updateCredentials(id, request.body);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.OK).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = request.params;
        const response = await this.service.deleteCredentials(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.NO_CONTENT).send();
    }
}
