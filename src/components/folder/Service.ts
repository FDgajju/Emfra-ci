import { FolderRepository } from './Repository';
import type { CreateFolderDto, Folder, UpdateFolderDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class FolderService {
    private repository: FolderRepository;

    constructor() {
        this.repository = new FolderRepository();
    }

    async getAllFolders(
        filter?: Partial<Omit<Folder, 'createdAt' | 'updatedAt'>>,
    ): Promise<ServiceResponse<Folder[]>> {
        try {
            const folders = await this.repository.getAll(filter);
            return createSuccessResponse(folders);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getFolderById(id: string): Promise<ServiceResponse<Folder | null>> {
        try {
            const folder = await this.repository.getById(id);
            if (!folder) {
                throw new AppError('Folder not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(folder);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async createFolder(data: CreateFolderDto): Promise<ServiceResponse<Folder | null>> {
        try {
            // Validate parent folder exists if provided
            if (data.parentFolderId) {
                const parentFolder = await this.repository.getById(data.parentFolderId);
                if (!parentFolder) {
                    throw new AppError('Parent folder not found', HTTP_STATUS.NOT_FOUND);
                }
            }

            const folder = await this.repository.createFolder(data);
            return createSuccessResponse(folder);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updateFolder(
        id: string,
        data: UpdateFolderDto,
    ): Promise<ServiceResponse<Folder | null>> {
        try {
            const existingFolder = await this.repository.getById(id);
            if (!existingFolder) {
                throw new AppError('Folder not found', HTTP_STATUS.NOT_FOUND);
            }

            // Validate parent folder exists if provided
            if (data.parentFolderId) {
                // Prevent circular references
                if (data.parentFolderId === id) {
                    throw new AppError(
                        'Folder cannot be its own parent',
                        HTTP_STATUS.BAD_REQUEST,
                    );
                }

                const parentFolder = await this.repository.getById(data.parentFolderId);
                if (!parentFolder) {
                    throw new AppError('Parent folder not found', HTTP_STATUS.NOT_FOUND);
                }
            }

            const updatedData = {
                name: data.name ?? existingFolder.name,
                description: data.description ?? existingFolder.description,
                parentFolderId: data.parentFolderId ?? existingFolder.parentFolderId,
            };

            const folder = await this.repository.updateFolder(id, updatedData);
            return createSuccessResponse(folder);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deleteFolder(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const folder = await this.repository.getById(id);
            if (!folder) {
                throw new AppError('Folder not found', HTTP_STATUS.NOT_FOUND);
            }

            // Check if folder has children
            const childFolders = await this.repository.findByParentId(id);
            if (childFolders.length > 0) {
                throw new AppError(
                    'Cannot delete folder with child folders',
                    HTTP_STATUS.BAD_REQUEST,
                );
            }

            await this.repository.deleteFolder(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}
