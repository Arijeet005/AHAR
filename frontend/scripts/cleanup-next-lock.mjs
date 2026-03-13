import fs from "node:fs/promises";
import path from "node:path";

const lockPath = path.join(process.cwd(), ".next", "dev", "lock");

try {
  await fs.rm(lockPath, { force: true });
} catch (error) {
  // On Windows, if another `next dev` is running it may hold a file handle and
  // deletion can fail. In that case, fail fast with a clearer message.
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === "EPERM" || code === "EACCES" || code === "EBUSY") {
    console.error(
      `Unable to remove Next dev lock at ${lockPath} (is another \`next dev\` still running?).`
    );
    process.exit(1);
  }

  throw error;
}

