import { commitToGit, getPreviousSpecYaml } from "@/lib/git/git";
import { specToGraph } from "@/lib/spec/graph";
import { diffGraphs } from "@/lib/spec/diff";
import { saveGraph, saveDiff, saveCommit } from "@/lib/db/supabase";

export async function runCommitPipeline({specYaml, message, user} 
: { specYaml : string, message : string, user : string}) {
  const previousSpecYaml = await getPreviousSpecYaml(); // load prev version
  const previousGraph = previousSpecYaml
    ? await specToGraph(previousSpecYaml.previousSpecYaml)
    : null;
  //^ build previous version of graph, if previousGraph is null then it returns null
  const commit = await commitToGit(specYaml, message, user);
  // ^ commit current version
  const newGraph = await specToGraph(specYaml);
  // ^ build current graph
  const diff = previousGraph ? diffGraphs(previousGraph, newGraph) : [];
  // ^ check for difference
  if (!commit.committed) {
    return {
      commitHash: commit.hash,
      changeCount: diff.length,
      changes: diff,
      committed: false
    };
  }
  await saveCommit({ hash: commit.hash, message, user}); //commit to git
  await saveGraph(newGraph,commit.hash); // save to supabase
  await saveDiff(diff,commit.hash); // save to supabase

  return {
    commitHash: commit.hash,
    changeCount: diff.length,
    changes: diff
  };
}