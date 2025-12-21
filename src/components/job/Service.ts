import { JobRepository } from './Repository';
import type { CreateJobDto, Job, UpdateJobDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { FolderRepository } from '../folder/Repository';
import { ProjectRepository } from '../project/Repository';
import { PipelineRepository } from '../pipeline/Repository';

export class JobService {
    private repository: JobRepository;
    private folderRepository: FolderRepository;
    private projectRepository: ProjectRepository;
    private pipelineRepository: PipelineRepository;

    constructor() {
        this.repository = new JobRepository();
        this.folderRepository = new FolderRepository();
        this.projectRepository = new ProjectRepository();
        this.pipelineRepository = new PipelineRepository();
    }

    async getAllJobs(
        filter?: Partial<Omit<Job, 'createdAt' | 'updatedAt'>>,
    ): Promise<ServiceResponse<Job[]>> {
        try {
            const jobs = await this.repository.getAll(filter);
            return createSuccessResponse(jobs);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getJobById(id: string): Promise<ServiceResponse<Job | null>> {
        try {
            const job = await this.repository.getById(id);
            if (!job) {
                throw new AppError('Job not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(job);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async createJob(data: CreateJobDto): Promise<ServiceResponse<Job | null>> {
        try {
            // Validate folder exists if provided
            if (data.folderId) {
                const folder = await this.folderRepository.getById(data.folderId);
                if (!folder) {
                    throw new AppError('Folder not found', HTTP_STATUS.NOT_FOUND);
                }
            }

            // Validate project exists
            const project = await this.projectRepository.getById(data.projectId);
            if (!project) {
                throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
            }

            // Validate pipeline exists
            const pipeline = await this.pipelineRepository.getById(data.pipelineId);
            if (!pipeline) {
                throw new AppError('Pipeline not found', HTTP_STATUS.NOT_FOUND);
            }

            const job = await this.repository.createJob(data);
            return createSuccessResponse(job);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updateJob(id: string, data: UpdateJobDto): Promise<ServiceResponse<Job | null>> {
        try {
            const existingJob = await this.repository.getById(id);
            if (!existingJob) {
                throw new AppError('Job not found', HTTP_STATUS.NOT_FOUND);
            }

            // Validate folder exists if provided
            if (data.folderId) {
                const folder = await this.folderRepository.getById(data.folderId);
                if (!folder) {
                    throw new AppError('Folder not found', HTTP_STATUS.NOT_FOUND);
                }
            }

            const updatedData = {
                name: data.name ?? existingJob.name,
                type: data.type ?? existingJob.type,
                folderId: data.folderId ?? existingJob.folderId,
                projectId: existingJob.projectId,
                pipelineId: existingJob.pipelineId,
                branch: data.branch ?? existingJob.branch,
                maxRunsToKeep: data.maxRunsToKeep ?? existingJob.maxRunsToKeep,
            };

            const job = await this.repository.updateJob(id, updatedData);
            return createSuccessResponse(job);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deleteJob(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const job = await this.repository.getById(id);
            if (!job) {
                throw new AppError('Job not found', HTTP_STATUS.NOT_FOUND);
            }

            await this.repository.deleteJob(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}
