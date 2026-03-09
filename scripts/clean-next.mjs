import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";

const nextDir = resolve(process.cwd(), ".next");

if (!existsSync(nextDir)) {
  console.log("No .next cache to clean");
  process.exit(0);
}

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

const tryRemove = () => {
  rmSync(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 100,
  });
};

const removeWithRetry = async () => {
  let lastError = null;

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      tryRemove();
      console.log("Cleaned .next cache");
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 5) await sleep(attempt * 100);
    }
  }

  try {
    execSync(`rm -rf "${nextDir}"`, { stdio: "ignore" });
    console.log("Cleaned .next cache (fallback)");
    return;
  } catch {
    // Preserve original error details for easier debugging.
    throw lastError;
  }
};

await removeWithRetry();
