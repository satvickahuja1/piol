import { connection, nodes } from "@/drizzle/schema";
import toposort from "toposort";
export const topological_sort = (
  node: (typeof nodes)[],
  connectio: (typeof connection)[],
) => {
  if (connectio.length === 0) {
    return node;
  }
  const edges: [string, string][] = connectio.map((con) => [
    con.fromnodeId,
    con.tonodeId,
  ]);
  const connectedNodeId = new Set<string>();
  for (const con of connectio) {
    connectedNodeId.add(con.fromnodeId);
    connectedNodeId.add(con.tonodeId);
  }
  for (const nod of node) {
    if (!connectedNodeId.has(nod.id)) {
      edges.push([nod.id, nod.id]);
    }
  }
  let sorted_node_id : string[]
  try{
    sorted_node_id = toposort(edges)
    sorted_node_id = [...new Set(sorted_node_id)]
  }catch(err){
    
  }
};
