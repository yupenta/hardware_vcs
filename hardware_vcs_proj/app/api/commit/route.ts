//from front to back end json request
import { runCommitPipeline } from "../../../lib/pipeline/onCommit";

export async function POST(req: Request) {
    const { yaml, msg, user } = await req.json();
    const ret = await runCommitPipeline({ specYaml: yaml, message: msg, user: user ?? "someone" });
    return Response.json(ret);
}