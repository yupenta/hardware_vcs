//from front to back end json request
import { runCommitPipeline } from "../../../lib/pipeline/onCommit";

export async function POST(req:Request){
    const { yaml, msg } = await req.json();
    const ret = await runCommitPipeline({yaml, msg, user: "someone"})
    return Response.json(ret)
}