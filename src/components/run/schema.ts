import { Type, Static } from '@sinclair/typebox';
import { RUN_STATUS } from '../../constants/constants';

// Base Run schema
export const RunSchema = Type.Object({
    id: Type.String(),
    jobId: Type.String(),
    projectId: Type.String(),
    pipelineId: Type.String(),
    branch: Type.String({ minLength: 1 }),
    commitSha: Type.Optional(Type.String()),
    status: Type.Enum(RUN_STATUS),
    startedAt: Type.String(),
    finishedAt: Type.Optional(Type.String()),
    logsPath: Type.Optional(Type.String()),
    artifactsPath: Type.Optional(Type.String()),
    triggeredBy: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Run schema
export const CreateRunSchema = Type.Object({
    jobId: Type.String(),
    projectId: Type.String(),
    pipelineId: Type.String(),
    branch: Type.String({ minLength: 1 }),
    commitSha: Type.Optional(Type.String()),
    status: Type.Enum(RUN_STATUS),
    startedAt: Type.String(),
    finishedAt: Type.Optional(Type.String()),
    logsPath: Type.Optional(Type.String()),
    artifactsPath: Type.Optional(Type.String()),
    triggeredBy: Type.Optional(Type.String()),
});

// Update Run schema
export const UpdateRunSchema = Type.Object({
    status: Type.Optional(Type.Enum(RUN_STATUS)),
    finishedAt: Type.Optional(Type.String()),
    logsPath: Type.Optional(Type.String()),
    artifactsPath: Type.Optional(Type.String()),
    commitSha: Type.Optional(Type.String()),
});

// TypeScript types
export type Run = Static<typeof RunSchema>;
export type CreateRunDto = Static<typeof CreateRunSchema>;
export type UpdateRunDto = Static<typeof UpdateRunSchema>;
