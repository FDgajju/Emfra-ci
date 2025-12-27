import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { env } from '../constants/env';
import { createHash } from 'node:crypto';
import { stdOutWrite } from '../utils/stdOut';
import { existsSync } from 'node:fs';
import { copyProjectToWorkspace, runCommand, type RunCommandOptions } from './run';

const GIT_USERNAME = ""
const GIT_PASSWORD = ""

const fileChekcOutInGit = (branch: string, file: string, options: Partial<RunCommandOptions>) => {
    try {

        runCommand("git", ["cat-file", "-e", `origin/${branch}:${file}`], { ...options, silence: true })
        return true
    } catch (error) {
        return false
    }
}

export const scanGitRepo = async (repo: string) => {
    try {
        const askPassScript = await createGitAskPass(GIT_USERNAME, GIT_PASSWORD)
        const projectName = path.basename(repo).split(".")[0]
        const gitPath = path.join(env.cachePath, `git-${createHash("sha256").update(repo).digest("hex")}`)

        const gitEnv = {
            GIT_ASKPASS: askPassScript as string,
            GIT_TERMINAL_PROMPT: "0",
            DISPLAY: "1"
        }

        // check the repo and credentials

        runCommand("git", ["--version"])

        stdOutWrite("Using GIT_ASKPASS to set credentials")
        runCommand('git', ['ls-remote', "--symref", "--", repo], { silence: true, env: gitEnv });

        // stdOutWrite(stdout)
        if (!existsSync(gitPath)) {
            await mkdir(gitPath, { recursive: true })
            stdOutWrite(`Creating repo in ${gitPath}`)
            runCommand("git", ["init", gitPath], { silence: true })

            stdOutWrite(`Setting origin repo in ${gitPath}`)
            runCommand("git", ["remote", "add", "origin", repo], { cwd: gitPath, silence: true })

        }

        stdOutWrite("Using GIT_ASKPASS to set credentials")
        runCommand("git", ["fetch", "--no-tags", "--force", "--progress", "--prune", "--", "origin", "+refs/heads/*:refs/remotes/origin/*"], { cwd: gitPath, env: gitEnv, silence: true })
        const isFileExist = fileChekcOutInGit("development", "Jenkinsfile", { cwd: gitPath, env: gitEnv })

        if (isFileExist) {
            stdOutWrite("Pipeline exist")
        } else {
            stdOutWrite("Pipeline not exist")
        }

        // if pipeline not exist

        // do add in repo
        // TODO.....
        // add in repo
        runCommand("git", ["pull", "origin", "development"], { env: gitEnv, silence: true, cwd: gitPath })

        runCommand("cp", [path.join(env.pipelinePath, "pipeline.yaml"), gitPath])
        const projectPath = copyProjectToWorkspace(gitPath, projectName)

        return projectPath
    } catch (error: any) {
        throw Error(error.message)
    }
};

const createGitAskPass = async (username: string, password: string) => {
    const scriptPath = path.join(os.tmpdir(), `username-${Date.now()}-git.sh`);

    await writeFile(
        scriptPath,
        `#!/bin/sh
        case $1 in
          Password*) echo ${password};;
          Username*) echo ${username};;
        esac
        `,
        { mode: 0o700 },
    );

    return scriptPath;
};