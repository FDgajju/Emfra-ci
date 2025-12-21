import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

export const env = {
    port: Number.parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    dataPath: path.resolve(process.env.DATA_PATH || '__data__'),
    workspacePath: path.resolve(process.env.WORKSPACE_PATH || '__workspace__'),
    // Derived paths - automatically set inside dataPath
    get collectionsPath() {
        return path.join(this.dataPath, 'collections');
    },
    get credentialsPath() {
        return path.join(this.dataPath, 'credentials');
    },
};
