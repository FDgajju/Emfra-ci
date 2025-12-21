import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Job } from './schema';
import type { JobType } from '../../constants/constants';

export interface IJob extends IBaseRepository {
    name: string;
    type: JobType;
    folderId?: string;
    projectId: string;
    pipelineId: string;
    branch: string;
    maxRunsToKeep?: number;
}

export class JobRepository extends BaseRepository<Job> {
    constructor() {
        super(MODEL_NAMES.JOB);
    }

    async getAll(filter?: Partial<Omit<Job, 'createdAt' | 'updatedAt'>>): Promise<Job[]> {
        return await this.find(filter);
    }

    async getById(id: string): Promise<Job | null> {
        return this.findById(id);
    }

    async createJob(data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
        return this.create(data);
    }

    async updateJob(
        id: string,
        data: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Job | null> {
        return this.update(id, data);
    }

    async deleteJob(id: string): Promise<void> {
        return this.delete(id);
    }

    async findByFolderId(folderId: string): Promise<Job[]> {
        return this.find({ folderId });
    }
}
