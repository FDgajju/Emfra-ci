import { PipelineRepository } from './Repository';
import type { CreatePipelineDto, Pipeline, UpdatePipelineDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class PipelineService {
    private repository: PipelineRepository;

    constructor() {
        this.repository = new PipelineRepository();
    }

    async getAllPipelines(): Promise<ServiceResponse<Pipeline[]>> {
        try {
            const pipelines = await this.repository.getAll();
            return createSuccessResponse(pipelines);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getPipelineById(id: string): Promise<ServiceResponse<Pipeline | null>> {
        try {
            const pipeline = await this.repository.getById(id);
            if (!pipeline) {
                throw new AppError('Pipeline not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(pipeline);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async createPipeline(data: CreatePipelineDto): Promise<ServiceResponse<Pipeline | null>> {
        try {
            const pipeline = await this.repository.createPipeline(data);
            return createSuccessResponse(pipeline);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updatePipeline(
        id: string,
        data: UpdatePipelineDto,
    ): Promise<ServiceResponse<Pipeline | null>> {
        try {
            const existingPipeline = await this.repository.getById(id);
            if (!existingPipeline) {
                throw new AppError('Pipeline not found', HTTP_STATUS.NOT_FOUND);
            }

            const updatedData = {
                name: data.name ?? existingPipeline.name,
                description: data.description ?? existingPipeline.description,
                pipelineFileName: data.pipelineFileName ?? existingPipeline.pipelineFileName,
            };

            const pipeline = await this.repository.updatePipeline(id, updatedData);
            return createSuccessResponse(pipeline);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deletePipeline(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const pipeline = await this.repository.getById(id);
            if (!pipeline) {
                throw new AppError('Pipeline not found', HTTP_STATUS.NOT_FOUND);
            }

            await this.repository.deletePipeline(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}
