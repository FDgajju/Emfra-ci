import { Type, Static } from '@sinclair/typebox';

// Base Pipeline schema
export const PipelineSchema = Type.Object({
    id: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    pipelineFileName: Type.String({ minLength: 1 }),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Pipeline schema
export const CreatePipelineSchema = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    pipelineFileName: Type.String({ minLength: 1 }),
});

// Update Pipeline schema
export const UpdatePipelineSchema = Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    pipelineFileName: Type.Optional(Type.String({ minLength: 1 })),
});

// TypeScript types
export type Pipeline = Static<typeof PipelineSchema>;
export type CreatePipelineDto = Static<typeof CreatePipelineSchema>;
export type UpdatePipelineDto = Static<typeof UpdatePipelineSchema>;
