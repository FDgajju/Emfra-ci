import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import type { MultipartFile } from '@fastify/multipart';
import { env } from '../constants/env';

/**
 * Save an uploaded file to the credentials directory
 * @param file - Multipart file from request
 * @param identifier - Credential identifier for filename prefix
 * @returns The saved file path relative to credentialsPath
 */
export async function saveCredentialFile(file: MultipartFile, identifier: string): Promise<string> {
    const timestamp = Date.now();
    const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${identifier}_${timestamp}_${sanitizedFilename}`;
    const filePath = path.join(env.credentialsPath, filename);

    // Save file
    await pipeline(file.file, createWriteStream(filePath));

    return filePath; // Return just the filename, not full path
}

/**
 * Get the full path for a credential file
 */
export function getCredentialFilePath(filename: string): string {
    return path.join(env.credentialsPath, filename);
}
