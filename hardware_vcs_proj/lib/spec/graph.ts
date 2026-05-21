import yaml from 'js-yaml'

export type GraphNode = {
  id: string;
  path: string;
  type: "group" | "param";
  value? : any;
};

export type Graph = {
  nodes: GraphNode[];
};

export async function specToGraph (yamltxt : string) : Promise<Graph> {
    const spec = yaml.load(yamltxt) as any
    const nodes: GraphNode[] = [];
    function walk( obj: any, path: string[] = []) {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = [...path, key];
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                nodes.push({
                    id: currentPath.join("."),
                    path: currentPath.join("."),
                    type: "group"});
                walk(value, currentPath);
            } else {
                nodes.push({
                    id: currentPath.join("."),
                    path: currentPath.join("."),
                    type: "param",
                    value}); }
    }
  }
  walk(spec);
  return { nodes };
}