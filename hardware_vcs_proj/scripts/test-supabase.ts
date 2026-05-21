import "dotenv/config";

import { saveCommit, saveDiff } from "../lib/db/supabase";

async function run() {
  try {
    console.log("Testing Supabase inserts...");

    await saveCommit({
      hash: "test1234",
      message: "test commit",
      user: "tester"
    });

    await saveDiff(
      [
        {
          path: "layers.test.value",
          type: "update",
          old: 1,
          new: 2
        }
      ],
      "test123"
    );

    console.log("DONE");
  } catch (err) {
    console.error("❌ ERROR CAUGHT:");
    console.error(err);
  }
}

run();