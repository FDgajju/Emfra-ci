import { CredentialsRepository } from './Repository';
import type { CreateCredentialsDto, Credentials, UpdateCredentialsDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';
import type { MultipartFile } from '@fastify/multipart';
import { saveCredentialFile } from '../../utils/fileUtils';
import type { CredentialType } from '../../constants/constants';

interface CreateCredentialsInput {
    identifier: string;
    type: CredentialType;
    username?: string;
    value?: string;
    file?: MultipartFile;
}

export class CredentialsService {
    private repository: CredentialsRepository;

    constructor() {
        this.repository = new CredentialsRepository();
    }

    /**
     * Validate credential data based on type
     */
    private async validateAndPrepareCredentials(
        input: CreateCredentialsInput,
    ): Promise<CreateCredentialsDto> {
        const { identifier, type, username, value, file } = input;

        let filePath: string | undefined;

        switch (type) {
            case 'ssh_key_with_username':
                if (!username) {
                    throw new AppError(
                        'Username is required for SSH key credentials',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }
                // Must have EITHER file OR value
                if (!file && !value) {
                    throw new AppError(
                        'Either key file or key content (value) is required for SSH key credentials',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }
                if (file) {
                    filePath = await saveCredentialFile(file, identifier);
                }
                break;

            case 'git':
                if (!username || !value) {
                    throw new AppError(
                        'Username and password/token (value) are required for Git credentials',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }
                break;

            case 'secret_file':
                if (!file) {
                    throw new AppError(
                        'File upload is required for secret file credentials',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }
                filePath = await saveCredentialFile(file, identifier);
                break;

            case 'secret_text':
                if (!value) {
                    throw new AppError(
                        'Value is required for secret text credentials',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }
                break;

            case 'certificate':
                if (!file) {
                    throw new AppError('Certificate file is required', HTTP_STATUS.BAD_REQUEST);
                }
                filePath = await saveCredentialFile(file, identifier);
                break;

            default:
                throw new AppError('Invalid credential type', HTTP_STATUS.BAD_REQUEST);
        }

        return {
            identifier,
            type,
            username,
            value,
            filePath,
        };
    }

    async getAllCredentials(
        filter?: Partial<Omit<Credentials, 'createdAt' | 'updatedAt'>>,
    ): Promise<ServiceResponse<Credentials[]>> {
        try {
            const credentials = await this.repository.getAll(filter);
            return createSuccessResponse(credentials);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getCredentialsById(id: string): Promise<ServiceResponse<Credentials | null>> {
        try {
            const credentials = await this.repository.getById(id);
            if (!credentials) {
                throw new AppError('Credentials not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(credentials);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async getOneCredential(filter: Partial<Credentials>) {
        try {
            const credentials = await this.repository.getAll(filter);
            if (!credentials.length) {
                throw new AppError('Credentials not found', HTTP_STATUS.NOT_FOUND);
            }

            return createSuccessResponse(credentials[0]);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async createCredentials(
        input: CreateCredentialsInput,
    ): Promise<ServiceResponse<Credentials | null>> {
        try {
            // Check if identifier already exists
            const existing = await this.repository.findByIdentifier(input.identifier);
            if (existing.length > 0) {
                throw new AppError(
                    'Credentials with this identifier already exist',
                    HTTP_STATUS.CONFLICT,
                );
            }

            // Validate and prepare data based on credential type
            const data = await this.validateAndPrepareCredentials(input);

            const credentials = await this.repository.createCredentials(data);
            return createSuccessResponse(credentials);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updateCredentials(
        id: string,
        data: UpdateCredentialsDto,
    ): Promise<ServiceResponse<Credentials | null>> {
        try {
            const existingCredentials = await this.repository.getById(id);
            if (!existingCredentials) {
                throw new AppError('Credentials not found', HTTP_STATUS.NOT_FOUND);
            }

            // Check if identifier already exists for another record
            if (data.identifier && data.identifier !== existingCredentials.identifier) {
                const existing = await this.repository.findByIdentifier(data.identifier);
                if (existing.length > 0) {
                    throw new AppError(
                        'Credentials with this identifier already exist',
                        HTTP_STATUS.CONFLICT,
                    );
                }
            }

            const updatedData = {
                identifier: data.identifier ?? existingCredentials.identifier,
                type: data.type ?? existingCredentials.type,
                value: data.value ?? existingCredentials.value,
                filePath: data.filePath ?? existingCredentials.filePath,
                username: data.username ?? existingCredentials.username,
            };

            const credentials = await this.repository.updateCredentials(id, updatedData);
            return createSuccessResponse(credentials);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deleteCredentials(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const credentials = await this.repository.getById(id);
            if (!credentials) {
                throw new AppError('Credentials not found', HTTP_STATUS.NOT_FOUND);
            }

            await this.repository.deleteCredentials(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}

export const credentialsService = new CredentialsService()