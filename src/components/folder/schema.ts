import { Type, Static } from '@sinclair/typebox';

// Base Folder schema
export const FolderSchema = Type.Object({
    id: Type.String(),
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    parentFolderId: Type.Optional(Type.String()),
    createdAt: Type.String(),
    updatedAt: Type.String(),
});

// Create Folder schema
export const CreateFolderSchema = Type.Object({
    name: Type.String({ minLength: 1, maxLength: 255 }),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    parentFolderId: Type.Optional(Type.String()),
});

// Update Folder schema
export const UpdateFolderSchema = Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
    description: Type.Optional(Type.String({ maxLength: 1000 })),
    parentFolderId: Type.Optional(Type.String()),
});

// TypeScript types
export type Folder = Static<typeof FolderSchema>;
export type CreateFolderDto = Static<typeof CreateFolderSchema>;
export type UpdateFolderDto = Static<typeof UpdateFolderSchema>;

// Route Schemas for Fastify
export const folderRouteSchemas = {
    getAll: {
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: Type.Array(FolderSchema),
            }),
        },
    },
    getById: {
        params: Type.Object({ id: Type.String() }),
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: FolderSchema,
            }),
        },
    },
    create: {
        body: CreateFolderSchema,
        response: {
            201: Type.Object({
                success: Type.Boolean(),
                data: FolderSchema,
            }),
        },
    },
    update: {
        params: Type.Object({ id: Type.String() }),
        body: UpdateFolderSchema,
        response: {
            200: Type.Object({
                success: Type.Boolean(),
                data: FolderSchema,
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
