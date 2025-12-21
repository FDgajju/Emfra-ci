import { Type, Static } from '@sinclair/typebox';
import { JOB_TYPE } from '../../constants/constants';

// Base Job schema
export const JobSchema = Type.Object({
    id: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 255 }),
    type: Type.Enum(JOB_TYPE),
    folderId: Type.Optional(Type.String()),
    projectId: Type.String(),
    pipelineId: Type.String(),
    branch: Type.String({ minLength: 1 }),
    maxRunsToKeep: Type.Optional(Type.Number({ minimum: 0 })),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Job schema
export const CreateJobSchema = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    type: Type.Enum(JOB_TYPE),
    folderId: Type.Optional(Type.String()),
    projectId: Type.String(),
    pipelineId: Type.String(),
    branch: Type.String({ minLength: 1 }),
    maxRunsToKeep: Type.Optional(Type.Number({ minimum: 0 })),
});

// Update Job schema
export const UpdateJobSchema = Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    type: Type.Optional(Type.Enum(JOB_TYPE)),
    folderId: Type.Optional(Type.String()),
    branch: Type.Optional(Type.String({ minLength: 1 })),
    maxRunsToKeep: Type.Optional(Type.Number({ minimum: 0 })),
});

// TypeScript types
export type Job = Static<typeof JobSchema>;
export type CreateJobDto = Static<typeof CreateJobSchema>;
export type UpdateJobDto = Static<typeof UpdateJobSchema>;

// Route Schemas for Fastify
export const jobRouteSchemas = {
    getAll: {
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: Type.Array(JobSchema),
            }),
        },
    },
    getById: {
        params: Type.Object({ id: Type.String() }),
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: JobSchema,
            }),
        },
    },
    create: {
        body: CreateJobSchema,
        response: {
            201: Type.Object({
                success: Type.Boolean(),
                data: JobSchema,
            }),
        },
    },
    update: {
        params: Type.Object({ id: Type.String() }),
        body: UpdateJobSchema,
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: JobSchema,
            }),
        },
    },
    delete: {
        params: Type.Object({ id: Type.String() }),
        response: {
            204: Type.Null(),
        },
    },
};
