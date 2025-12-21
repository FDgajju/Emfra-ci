import type { FastifyReply, FastifyRequest } from 'fastify';
import { JobService } from './Service';
import type { Job, CreateJobDto, UpdateJobDto } from './schema';
import { CatchHandler } from '../../decorators/CatchHandler';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class JobController {
    private service: JobService;

    constructor() {
        this.service = new JobService();
    }

    @CatchHandler
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        // Extract query parameters as filter
        const filter = request.query as Partial<Omit<Job, 'createdAt' | 'updatedAt'>>;
        const response = await this.service.getAllJobs(filter);

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
        const response = await this.service.getJobById(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.OK).send({
            success: true,
            data: response.data,
        });
    }

    @CatchHandler
    async create(request: FastifyRequest<{ Body: CreateJobDto }>, reply: FastifyReply) {
        const response = await this.service.createJob(request.body);

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
        request: FastifyRequest<{ Params: { id: string }; Body: UpdateJobDto }>,
        reply: FastifyReply,
    ) {
        const { id } = request.params;
        const response = await this.service.updateJob(id, request.body);

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
        const response = await this.service.deleteJob(id);

        if (!response.status) {
            throw response.error;
        }

        return reply.status(HTTP_STATUS.NO_CONTENT).send();
    }
}
