import { createClient } from '@supabase/supabase-js'
import {Graph} from '@/lib/spec/graph'
import { SemanticChange } from '../spec/diff';
import "dotenv/config";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
export async function saveGraph(graph : Graph,commitHash : string) {
  const rows = graph.nodes.map(node => ({
    commit_hash: commitHash,
    path: node.path,
    type: node.type,
    value: node.value ?? null
  }));
  const { data, error } = await supabase .from("spec_nodes") .insert(rows);
  if (error) { throw error; }
  return data;
}

export async function saveDiff( diff: SemanticChange[], hash: string) {
  const rows = diff.map(change => ({
    commit_hash: hash,
    path: change.path,
    type: change.type,
    old_value: change.old ?? null,
    new_value: change.new ?? null
  }));

  const { error } = await supabase .from("changes") .insert(rows);

  if (error) {  throw error;  }
}

export async function saveCommit({hash, message, user}:{ hash: string; message: string; user: string;}) {
  const { error } = await supabase .from("commits") .insert({hash, message, user_name: user});
  if (error) { throw error;}
}