import { simpleGit } from 'simple-git';
import fs from 'fs'
import yaml from 'js-yaml'

import path from "path";
const REPO_PATH = path.resolve("./repo");
const SENSOR_PATH = path.join(REPO_PATH, "sensor.yaml");
const git = simpleGit(REPO_PATH);

export async function commitToGit (specYaml : string, message :string, user :string) {
  fs.writeFileSync(SENSOR_PATH, specYaml, 'utf8');

  if (!(await git.checkIsRepo())) {
    await git.init();
    await git.addConfig('user.name', 'hardware-vcs-bot');
    await git.addConfig('user.email', 'hardware-vcs-bot@example.com');
  }

  await git.add("./*");
  const result = await git.commit(message);
  const committed = Boolean(result.commit);
  const commitHash = committed
    ? result.commit!
    : await git.revparse(["HEAD"]);
  return { hash: commitHash, committed };
}

export async function getPreviousSpecYaml () {
    try {
        const text = fs.readFileSync(SENSOR_PATH, "utf8");
        return { previousSpecYaml: text };
    } catch (err) {
        return null;
    }
}