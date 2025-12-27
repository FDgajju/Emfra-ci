interface SSHPut {
    host: string;
    port: string;
    key: string;
    localPath: string;
    remotePath: string;
}

interface SSHCommand {
    host: string;
    port: string;
    key: string;
    command: string;
}

export interface Stage {
    name: string;
    when: { branch: string[] };
    run?: string[];
    sshPut?: SSHPut;
    sshCommand?: SSHCommand;
}

export interface Pipeline {
    version: string;
    env: { [key: string]: string };
    stages: Stage[];
}
