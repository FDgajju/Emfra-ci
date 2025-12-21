import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Pipeline } from './schema';

export interface IPipeline extends IBaseRepository {
    name: string;
    description?: string;
    pipelineFileName: string;
}

export class PipelineRepository extends BaseRepository<Pipeline> {
    constructor() {
        super(MODEL_NAMES.PIPELINE);
    }

    async getAll(): Promise<Pipeline[]> {
        return this.find();
    }

    async getById(id: string): Promise<Pipeline | null> {
        return this.findById(id);
    }

    async createPipeline(
        data: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Pipeline> {
        return this.create(data);
    }

    async updatePipeline(
        id: string,
        data: Omit<Pipeline, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Pipeline | null> {
        return this.update(id, data);
    }

    async deletePipeline(id: string): Promise<void> {
        return this.delete(id);
    }
}
