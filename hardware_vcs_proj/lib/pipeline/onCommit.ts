import { commitToGit, getPreviousSpecYaml } from "@/lib/git/git";
import { specToGraph } from "@/lib/spec/graph";
import { diffGraphs } from "@/lib/spec/diff";
import { saveGraph, saveDiff, saveCommit } from "@/lib/db/supabase";

export async function runCommitPipeline({specYaml, message, user} 
: { specYaml : string, message : string, user : string}) {
  const previousSpecYaml = await getPreviousSpecYaml(); // load prev version
  const previousGraph = previousSpecYaml ? specToGraph(previousSpecYaml.previousSpecYaml) : null;
  console.log("GRAPH OUTPUT:", previousGraph); 
  //^ build previous version of graph, if previousGraph is null then it returns null
  const commit = await commitToGit(specYaml, message, user);
  // ^ commit current version
  const newGraph = specToGraph(specYaml);
  // ^ build current graph
  const diff = previousGraph ? diffGraphs( await previousGraph, await newGraph) : [];
  // ^ check for difference
  await saveCommit({ hash: commit.hash, message, user}); //commit to git
  await saveGraph(newGraph,commit.hash); // save to supabase
  await saveDiff(diff,commit.hash); // save to supabase

  return {
    commitHash: commit.hash,
    changeCount: diff.length,
    changes: diff
  };
}