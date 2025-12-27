import path from 'node:path';
import { pipelineValidator } from './pipelineValidator';
import { scanGitRepo } from './git';
import { runSteps } from './run';

const main = async () => {

    const GIT_URL = "https://gajju22@bitbucket.org/emertechio/bkt-eudr-api.git"

    const projectPath = await scanGitRepo(GIT_URL)

    const pipelinePath = path.join(projectPath, 'pipeline.yaml');

    const pipeline = await pipelineValidator.validateAndParsePipeline(pipelinePath);

    await runSteps(pipeline, projectPath)
};

main()