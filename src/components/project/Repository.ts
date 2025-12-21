import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Project } from './schema';

export interface IProject extends IBaseRepository {
    name: string;
    repoUrl: string;
    defaultBranch: string;
    workspacePath: string;
    credentialsId?: string;
}

export class ProjectRepository extends BaseRepository<Project> {
    constructor() {
        super(MODEL_NAMES.PROJECT);
    }

    async getAll(): Promise<Project[]> {
        return this.find();
    }

    async getById(id: string): Promise<Project | null> {
        return this.findById(id);
    }

    async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        return this.create(data);
    }

    async updateProject(
        id: string,
        data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Project | null> {
        return this.update(id, data);
    }

    async deleteProject(id: string): Promise<void> {
        return this.delete(id);
    }
}
