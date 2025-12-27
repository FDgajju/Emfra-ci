import type { FastifyReply, FastifyRequest } from 'fastify';
import { FolderService } from './Service';
import type { Folder, CreateFolderDto, UpdateFolderDto } from './schema';
import { CatchHandler } from '../../decorators/CatchHandler';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class FolderController {
    private service: FolderService;

    constructor() {
        this.service = new FolderService();
    }

    @CatchHandler
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        // Extract query parameters as filter
        const filter = request.query as Partial<Omit<Folder, 'createdAt' | 'updatedAt'>>;
        const response = await this.service.getAllFolders(filter);

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
        const response = await this.service.getFolderById(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.OK).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async create(request: FastifyRequest<{ Body: CreateFolderDto }>, reply: FastifyReply) {
        const response = await this.service.createFolder(request.body);

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
        request: FastifyRequest<{ Params: { id: string }; Body: UpdateFolderDto }>,
        reply: FastifyReply,
    ) {
        const { id } = request.params;
        const response = await this.service.updateFolder(id, request.body);

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
        const response = await this.service.deleteFolder(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.NO_CONTENT).send();
    }
}
