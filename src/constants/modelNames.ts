export const MODEL_NAMES = {
    FOLDER: 'folders',
    PROJECT: 'projects',
    PIPELINE: 'pipelines',
    JOB: 'jobs',
    RUN: 'runs',
    CREDENTIALS: 'credentials',
} as const;

export type ModelName = (typeof MODEL_NAMES)[keyof typeof MODEL_NAMES];
