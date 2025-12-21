import { Type, Static } from '@sinclair/typebox';
import { CREDENTIAL_TYPES } from '../../constants/constants';

// Base Credentials schema
export const CredentialsSchema = Type.Object({
    id: Type.String(),
    identifier: Type.String({ minLength: 1, maxLength: 255 }),
    type: Type.Enum(CREDENTIAL_TYPES),
    value: Type.Optional(Type.String()),
    filePath: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Credentials schema
export const CreateCredentialsSchema = Type.Object({
    identifier: Type.String({ minLength: 1, maxLength: 255 }),
    type: Type.Enum(CREDENTIAL_TYPES),
    value: Type.Optional(Type.String()),
    filePath: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
});

// Update Credentials schema
export const UpdateCredentialsSchema = Type.Object({
    identifier: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    type: Type.Optional(Type.Enum(CREDENTIAL_TYPES)),
    value: Type.Optional(Type.String()),
    filePath: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
});

// TypeScript types
export type Credentials = Static<typeof CredentialsSchema>;
export type CreateCredentialsDto = Static<typeof CreateCredentialsSchema>;
export type UpdateCredentialsDto = Static<typeof UpdateCredentialsSchema>;

// Route Schemas for Fastify
export const credentialsRouteSchemas = {
    getAll: {
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: Type.Array(CredentialsSchema),
            }),
        },
    },
    getById: {
        params: Type.Object({ id: Type.String() }),
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: CredentialsSchema,
            }),
        },
    },
    create: {
        // multipart - no body validation
        response: {
            201: Type.Object({
                success: Type.Boolean(),
                data: CredentialsSchema,
            }),
        },
    },
    update: {
        params: Type.Object({ id: Type.String() }),
        body: UpdateCredentialsSchema,
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: CredentialsSchema,
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
