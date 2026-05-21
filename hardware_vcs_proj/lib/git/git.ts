import { simpleGit } from 'simple-git';
import fs from 'fs'
import yaml from 'js-yaml'

const REPO_PATH = "/repo";

const git = simpleGit(REPO_PATH);

export async function commitToGit (specYaml : string, message :string, user :string) {
  fs.writeFileSync("/repo/spec.yaml", specYaml);
  await git.add("./*");
  const result = await git.commit(message);
  return {hash: result.commit};
}

export async function getPreviousSpecYaml () {
    fs.writeFileSync("./temp.yaml", "/repo/spec.yaml")
    const f = await fetch('./sensor.yaml')
    const text = await f.text()
    return {previousSpecYaml : text};    
}