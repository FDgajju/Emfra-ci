import { RunRepository } from './Repository';
import type { CreateRunDto, Run, UpdateRunDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class RunService {
    private repository: RunRepository;

    constructor() {
        this.repository = new RunRepository();
    }

    async getAllRuns(): Promise<ServiceResponse<Run[]>> {
        try {
            const runs = await this.repository.getAll();
            return createSuccessResponse(runs);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getRunById(id: string): Promise<ServiceResponse<Run | null>> {
        try {
            const run = await this.repository.getById(id);
            if (!run) {
                throw new AppError('Run not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(run);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async getRunsByJobId(jobId: string): Promise<ServiceResponse<Run[]>> {
        try {
            const runs = await this.repository.findByJobId(jobId);
            return createSuccessResponse(runs);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async createRun(data: CreateRunDto): Promise<ServiceResponse<Run | null>> {
        try {
            const run = await this.repository.createRun(data);
            return createSuccessResponse(run);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updateRun(id: string, data: UpdateRunDto): Promise<ServiceResponse<Run | null>> {
        try {
            const existingRun = await this.repository.getById(id);
            if (!existingRun) {
                throw new AppError('Run not found', HTTP_STATUS.NOT_FOUND);
            }

            const updatedData = {
                jobId: existingRun.jobId,
                projectId: existingRun.projectId,
                pipelineId: existingRun.pipelineId,
                branch: existingRun.branch,
                commitSha: data.commitSha ?? existingRun.commitSha,
                status: data.status ?? existingRun.status,
                startedAt: existingRun.startedAt,
                finishedAt: data.finishedAt ?? existingRun.finishedAt,
                logsPath: data.logsPath ?? existingRun.logsPath,
                artifactsPath: data.artifactsPath ?? existingRun.artifactsPath,
                triggeredBy: existingRun.triggeredBy,
            };

            const run = await this.repository.updateRun(id, updatedData);
            return createSuccessResponse(run);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deleteRun(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const run = await this.repository.getById(id);
            if (!run) {
                throw new AppError('Run not found', HTTP_STATUS.NOT_FOUND);
            }

            await this.repository.deleteRun(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}
