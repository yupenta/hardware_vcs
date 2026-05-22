import "dotenv/config";
import { runCommitPipeline } from "../lib/pipeline/onCommit";

async function main() {
  try {
    const result = await runCommitPipeline({
      specYaml: `layers:
  sensing:
    capture_antibody: 47
`,
      message: "decrease capture_antibody",
      user: "yupentacat",
    });

    console.log("RESULT", result);
  } catch (err) {
    console.error("ERROR", err);
    process.exit(1);
  }
}

main();