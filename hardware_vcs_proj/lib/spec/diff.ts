import { Graph } from "./graph";

export type SemanticChange = {
  path: string;
  type: "add" | "remove" | "update";
  old?: any;
  new?: any;
};

export function diffGraphs(oldGraph: Graph, newGraph: Graph): SemanticChange[] {
  const changes: SemanticChange[] = [];
  const oldMap = new Map(oldGraph.nodes.map(n => [n.path, n]));
  const newMap = new Map(newGraph.nodes.map(n => [n.path, n]));

  const allPaths = new Set([...oldMap.keys(),...newMap.keys()]);

  for (const path of allPaths) {
    const oldNode = oldMap.get(path);
    const newNode = newMap.get(path);

    if (!oldNode && newNode) {
      changes.push({
        path,
        type: "add",
        new: newNode.value});
      continue;
    }

    if (oldNode && !newNode) {
      changes.push({
        path,
        type: "remove",
        old: oldNode.value});
      continue;
    }

    if (oldNode?.value !== newNode?.value) {
      changes.push({
        path,
        type: "update",
        old: oldNode?.value,
        new: newNode?.value});
    }
  }
  return changes;
}

