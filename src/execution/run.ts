import path from "node:path"
import { env } from "../constants/env"
import { cp, mkdir } from "node:fs/promises"
import { Pipeline } from "./types"
import { stdOutWrite } from "../utils/stdOut";
import { spawnSync, type SpawnSyncOptionsWithStringEncoding } from "node:child_process";
import { pipelineValidator } from "./pipelineValidator";
import { credentialsService } from "../components/credentials/Service";
import { CREDENTIAL_TYPES } from "../constants/constants";
import { Credentials } from "../components/credentials/schema";

export interface RunCommandOptions extends SpawnSyncOptionsWithStringEncoding {
    silence?: boolean;
    allowFailiur?: boolean;
}

export const runCommand = (command: string, args: string[] = [], options: Partial<RunCommandOptions> = {}) => {
    const { silence = false, allowFailiur = true, ...commandOptions } = options;


    stdOutWrite(`${command} ${args.join(" ")}`)
    const cp = spawnSync(command, args, commandOptions);

    if (cp.error) {
        stdOutWrite('Failed start the command');
        throw new Error(cp.error.message, { cause: cp.error.cause });
    }

    if (!silence) {
        stdOutWrite(cp.stdout);
        stdOutWrite(cp.stderr);
    }

    // if (cp.status !== 0 && allowFailiur) {
    //     throw new Error(
    //         `Command failed: ${command} ${args.join(' ')} with exit code: ${cp.status}`,
    //     );
    // }

    return {
        code: cp.status,
        stdout: cp.stdout,
        stderr: cp.stderr,
    }
};

export const copyProjectToWorkspace = async (clonePath: string, name: string) => {
    const projectPath = path.join(env.workspacePath, name, "development")

    await mkdir(projectPath, { recursive: true })

    await cp(clonePath, projectPath, { recursive: true })

    return projectPath
}

export const runSteps = async (pipeline: Pipeline, projectPath: string) => {

    let pipelineString = JSON.stringify(pipeline)

    const secrets: Record<string, Credentials> = {}
    const secretKeys = pipelineValidator.extractSecrets(pipelineString)

    console.log(secretKeys)

    for (const key of secretKeys) {

        const cred = await credentialsService.getOneCredential({ identifier: key })

        if (cred.error) throw new Error(`Credential ${key} not found`)
        if (!cred.data) throw new Error(`Credential ${key} not found`)

        if (cred.data.type === CREDENTIAL_TYPES.SECRET_FILE || cred.data.type === CREDENTIAL_TYPES.CERTIFICATE) {
            pipelineString = pipelineString.replaceAll(`{{${key}}}`, cred.data.filePath as string)
        } else if (cred.data.type === CREDENTIAL_TYPES.GIT || cred.data.type === CREDENTIAL_TYPES.SECRET_TEXT) {
            pipelineString = pipelineString.replaceAll(`{{${key}}}`, cred.data.value as string)
        } else {

            if (!cred.data.username || !cred.data.filePath) throw new Error(`Credential ${key} not configured propperly`)
            secrets[key] = cred.data
            pipelineString = pipelineString.replaceAll(`{{${key}}}`, cred.data.identifier as string)

        }
    }

    for (const key in pipeline.env) {
        const value = pipeline.env[key]

        pipelineString = pipelineString.replaceAll(`\${${key}}`, value)
    }



    const runPipeline = JSON.parse(pipelineString) as Pipeline

    for (const step of runPipeline.stages) {

        if (step.run && step.run.length) {
            runCommand("sh", ["-c", step.run.join(" && ")], { cwd: projectPath })
        }

        if (step.sshPut) {

            const creds = secrets[step.sshPut.key]

            runCommand("scp", ["-i", creds.filePath as string, "-P", step.sshPut.port, step.sshPut.localPath, `${creds.username}@${step.sshPut.host}:${step.sshPut.remotePath}`], { cwd: projectPath })
        }

        if (step.sshCommand) {
            const creds = secrets[step.sshCommand.key]
            runCommand("ssh", ["-i", creds.filePath as string, "-p", step.sshCommand.port, `${creds.username}@${step.sshCommand.host}`, step.sshCommand.command], { cwd: projectPath, silence: false, allowFailiur: true })

        }
    }
}