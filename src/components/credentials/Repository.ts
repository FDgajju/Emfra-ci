import { BaseRepository, type IBaseRepository } from '../../baseRepository';
import { MODEL_NAMES } from '../../constants/modelNames';
import type { Credentials } from './schema';
import type { CredentialType } from '../../constants/constants';

export interface ICredentials extends IBaseRepository {
    identifier: string;
    type: CredentialType;
    value?: string;
    filePath?: string;
    username?: string;
}

export class CredentialsRepository extends BaseRepository<Credentials> {
    constructor() {
        super(MODEL_NAMES.CREDENTIALS);
    }

    async getAll(
        filter?: Partial<Omit<Credentials, 'createdAt' | 'updatedAt'>>,
    ): Promise<Credentials[]> {
        return await this.find(filter);
    }

    async getById(id: string): Promise<Credentials | null> {
        return this.findById(id);
    }

    async createCredentials(
        data: Omit<Credentials, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Credentials> {
        return this.create(data);
    }

    async updateCredentials(
        id: string,
        data: Omit<Credentials, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Credentials | null> {
        return this.update(id, data);
    }

    async deleteCredentials(id: string): Promise<void> {
        return this.delete(id);
    }

    async findByIdentifier(identifier: string): Promise<Credentials[]> {
        return this.find({ identifier });
    }
}
