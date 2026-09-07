import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const outputRoot = path.resolve("dist/client");

async function addDirectoryIndexes(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await addDirectoryIndexes(sourcePath);
      continue;
    }

    if (!entry.name.endsWith(".html") || entry.name === "index.html" || entry.name === "404.html") {
      continue;
    }

    const routeDirectory = path.join(directory, entry.name.slice(0, -5));
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(sourcePath, path.join(routeDirectory, "index.html"));
  }
}

await addDirectoryIndexes(outputRoot);
