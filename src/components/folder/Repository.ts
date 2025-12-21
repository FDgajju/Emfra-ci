import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Folder } from './schema';

export interface IFolder extends IBaseRepository {
    name: string;
    description?: string;
    parentFolderId?: string;
}

export class FolderRepository extends BaseRepository<Folder> {
    constructor() {
        super(MODEL_NAMES.FOLDER);
    }

    async getAll(filter?: Partial<Omit<Folder, 'createdAt' | 'updatedAt'>>): Promise<Folder[]> {
        return await this.find(filter);
    }

    async getById(id: string): Promise<Folder | null> {
        return this.findById(id);
    }

    async createFolder(data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> {
        return this.create(data);
    }

    async updateFolder(
        id: string,
        data: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Folder | null> {
        return this.update(id, data);
    }

    async deleteFolder(id: string): Promise<void> {
        return this.delete(id);
    }

    async findByParentId(parentFolderId: string): Promise<Folder[]> {
        return this.find({ parentFolderId });
    }
}
