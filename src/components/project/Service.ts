import { ProjectRepository } from './Repository';
import type { CreateProjectDto, Project, UpdateProjectDto } from './schema';
import type { ServiceResponse } from '../../utils/ServiceResponse';
import { createErrorResponse, createSuccessResponse } from '../../utils/ServiceResponse';
import { AppError } from '../../utils/AppError';
import { HTTP_STATUS } from '../../constants/httpStatus';

export class ProjectService {
    private repository: ProjectRepository;

    constructor() {
        this.repository = new ProjectRepository();
    }

    async getAllProjects(): Promise<ServiceResponse<Project[]>> {
        try {
            const projects = await this.repository.getAll();
            return createSuccessResponse(projects);
        } catch (error) {
            return createErrorResponse(error as Error, []);
        }
    }

    async getProjectById(id: string): Promise<ServiceResponse<Project | null>> {
        try {
            const project = await this.repository.getById(id);
            if (!project) {
                throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
            }
            return createSuccessResponse(project);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async createProject(data: CreateProjectDto): Promise<ServiceResponse<Project | null>> {
        try {
            const project = await this.repository.createProject(data);
            return createSuccessResponse(project);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async updateProject(
        id: string,
        data: UpdateProjectDto,
    ): Promise<ServiceResponse<Project | null>> {
        try {
            const existingProject = await this.repository.getById(id);
            if (!existingProject) {
                throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
            }

            const updatedData = {
                name: data.name ?? existingProject.name,
                repoUrl: data.repoUrl ?? existingProject.repoUrl,
                defaultBranch: data.defaultBranch ?? existingProject.defaultBranch,
                workspacePath: data.workspacePath ?? existingProject.workspacePath,
                credentialsId: data.credentialsId ?? existingProject.credentialsId,
            };

            const project = await this.repository.updateProject(id, updatedData);
            return createSuccessResponse(project);
        } catch (error) {
            return createErrorResponse(error as Error, null);
        }
    }

    async deleteProject(id: string): Promise<ServiceResponse<boolean>> {
        try {
            const project = await this.repository.getById(id);
            if (!project) {
                throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
            }

            await this.repository.deleteProject(id);
            return createSuccessResponse(true);
        } catch (error) {
            return createErrorResponse(error as Error, false);
        }
    }
}
