import "dotenv/config";

import { specToGraph } from "../lib/spec/graph";
import { diffGraphs } from "../lib/spec/diff";
import { supabase } from "../lib/db/supabase";

function logStep(step: string) {
  console.log(`\n=== ${step} ===`);
}

async function run() {
  try {
    logStep("1. INPUT SPECS");

    const oldYaml = `
layers:
  sensing:
    capture_antibody: 20
`;

    const newYaml = `
layers:
  sensing:
    capture_antibody: 50
`;

    logStep("2. BUILD GRAPHS");

    const oldGraph = specToGraph(oldYaml);
    const newGraph = specToGraph(newYaml);

    console.log("old nodes:", (await oldGraph).nodes.length);
    console.log("new nodes:", (await newGraph).nodes.length);

    logStep("3. DIFF");

    const diff = diffGraphs(await oldGraph, await newGraph);

    console.log(diff);

    if (diff.length === 0) {
      throw new Error("❌ No diff detected (unexpected)");
    }

    logStep("4. SIMULATE COMMIT");

    const commitHash = `e2e_${Date.now()}`;

    logStep("5. SAVE COMMIT");

    const commitRes = await supabase
      .from("commits")
      .insert({
        hash: commitHash,
        message: "e2e test commit",
        user_name: "tester"
      });

    if (commitRes.error) throw commitRes.error;

    logStep("6. SAVE SPEC NODES");

    const nodes = (await newGraph).nodes.map(n => ({
      commit_hash: commitHash,
      path: n.path,
      type: n.type,
      value: n.value ?? null
    }));

    const nodeRes = await supabase
      .from("spec_nodes")
      .insert(nodes);

    if (nodeRes.error) throw nodeRes.error;

    logStep("7. SAVE DIFFS");

    const diffRows = diff.map(d => ({
      commit_hash: commitHash,
      path: d.path,
      type: d.type,
      old_value: d.old ?? null,
      new_value: d.new ?? null
    }));

    const diffRes = await supabase
      .from("changes")
      .insert(diffRows);

    if (diffRes.error) throw diffRes.error;

    logStep("8. VERIFY DATABASE");

    const { data: dbNodes } = await supabase
      .from("spec_nodes")
      .select("*")
      .eq("commit_hash", commitHash);

    const { data: dbDiff } = await supabase
      .from("changes")
      .select("*")
      .eq("commit_hash", commitHash);

    const { data: dbCommit } = await supabase
      .from("commits")
      .select("*")
      .eq("hash", commitHash)
      .single();

    console.log("nodes stored:", dbNodes?.length);
    console.log("diff stored:", dbDiff?.length);
    console.log("commit stored:", !!dbCommit);

    logStep("9. FINAL RESULT");

    if (!dbNodes?.length || !dbDiff?.length || !dbCommit) {
      throw new Error("❌ E2E FAILED: missing DB data");
    }

    console.log("✅ E2E TEST PASSED");

  } catch (err) {
    console.error("\n❌ E2E TEST FAILED:");
    console.error(err);
    process.exit(1);
  }
}

run();