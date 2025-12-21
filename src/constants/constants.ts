export const JOB_TYPE = {
    PIPELINE: 'pipeline',
    MULTIBRANCH: 'multibranch',
} as const;

export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];

export const RUN_STATUS = {
    QUEUED: 'queued',
    RUNNING: 'running',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
} as const;

export type RunStatus = (typeof RUN_STATUS)[keyof typeof RUN_STATUS];

export const CREDENTIAL_TYPES = {
    SSH_KEY_WITH_USERNAME: 'ssh_key_with_username',
    GIT: 'git',
    SECRET_FILE: 'secret_file',
    SECRET_TEXT: 'secret_text',
    CERTIFICATE: 'certificate',
} as const;

export type CredentialType = (typeof CREDENTIAL_TYPES)[keyof typeof CREDENTIAL_TYPES];
