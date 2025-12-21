import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Run } from './schema';
import type { RunStatus } from '../../constants/constants';

export interface IRun extends IBaseRepository {
    jobId: string;
    projectId: string;
    pipelineId: string;
    branch: string;
    commitSha?: string;
    status: RunStatus;
    startedAt: string;
    finishedAt?: string;
    logsPath?: string;
    artifactsPath?: string;
    triggeredBy?: string;
}

export class RunRepository extends BaseRepository<Run> {
    constructor() {
        super(MODEL_NAMES.RUN);
    }

    async getAll(): Promise<Run[]> {
        return this.find();
    }

    async getById(id: string): Promise<Run | null> {
        return this.findById(id);
    }

    async createRun(data: Omit<Run, 'id' | 'createdAt' | 'updatedAt'>): Promise<Run> {
        return this.create(data);
    }

    async updateRun(
        id: string,
        data: Omit<Run, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Run | null> {
        return this.update(id, data);
    }

    async deleteRun(id: string): Promise<void> {
        return this.delete(id);
    }

    async findByJobId(jobId: string): Promise<Run[]> {
        return this.find({ jobId });
    }
}
