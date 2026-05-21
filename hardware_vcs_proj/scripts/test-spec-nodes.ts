import "dotenv/config";

import { specToGraph } from "@/lib/spec/graph";
import { supabase } from "@/lib/db/supabase";

async function run() {
  const yaml = `
layers:
  sensing:
    capture_antibody: 20
`;

  console.log("🔧 building graph...");

  const graph = specToGraph(yaml);

  console.log("📦 inserting into spec_nodes...");

  const commitHash = "test_spec_nodes_1";

  const rows = (await graph).nodes.map(node => ({
    commit_hash: commitHash,
    path: node.path,
    type: node.type,
    value: node.value ?? null
  }));

  const { error } = await supabase
    .from("spec_nodes")
    .insert(rows);

  if (error) {
    console.error("❌ INSERT FAILED:");
    console.error(error);
    return;
  }

  console.log("✅ INSERT SUCCESS");

  const { data } = await supabase
    .from("spec_nodes")
    .select("*")
    .eq("commit_hash", commitHash);

  console.log("📊 RESULT FROM DB:");
  console.log(data);
}

run();