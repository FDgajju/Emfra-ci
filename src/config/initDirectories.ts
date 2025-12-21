import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

/**
 * Initialize required directories for the application
 */
export function initializeDirectories(baseDataPath: string, baseWorkspacePath: string) {
    const directories = [
        baseDataPath,
        path.join(baseDataPath, 'collections'),
        path.join(baseDataPath, 'credentials'),
        baseWorkspacePath,
    ];

    for (const dir of directories) {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    }
}
