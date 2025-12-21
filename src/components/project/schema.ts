import { Type, Static } from '@sinclair/typebox';

// Base Project schema
export const ProjectSchema = Type.Object({
    id: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 255 }),
    repoUrl: Type.String({ minLength: 1 }),
    defaultBranch: Type.String({ minLength: 1 }),
    workspacePath: Type.String({ minLength: 1 }),
    credentialsId: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Project schema
export const CreateProjectSchema = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    repoUrl: Type.String({ minLength: 1 }),
    defaultBranch: Type.String({ minLength: 1 }),
    workspacePath: Type.String({ minLength: 1 }),
    credentialsId: Type.Optional(Type.String()),
});

// Update Project schema
export const UpdateProjectSchema = Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    repoUrl: Type.Optional(Type.String({ minLength: 1 })),
    defaultBranch: Type.Optional(Type.String({ minLength: 1 })),
    workspacePath: Type.Optional(Type.String({ minLength: 1 })),
    credentialsId: Type.Optional(Type.String()),
});

// TypeScript types
export type Project = Static<typeof ProjectSchema>;
export type CreateProjectDto = Static<typeof CreateProjectSchema>;
export type UpdateProjectDto = Static<typeof UpdateProjectSchema>;
