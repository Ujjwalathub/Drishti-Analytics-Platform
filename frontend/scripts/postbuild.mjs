import { cp, mkdir, readdir, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(rootDir, "dist");
const clientDir = resolve(distDir, "client");
const publicDir = resolve(rootDir, ".output", "public");

// Helper to check if a path exists
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (await exists(clientDir)) {
  // If nitro is disabled, Vite built client files to dist/client
  // We copy client assets to a temporary directory, clean dist, and copy them to the root dist folder
  const tempDir = resolve(rootDir, "dist-temp");
  await rm(tempDir, { recursive: true, force: true });
  await cp(clientDir, tempDir, { recursive: true });
  await rm(distDir, { recursive: true, force: true });
  await cp(tempDir, distDir, { recursive: true });
  await rm(tempDir, { recursive: true, force: true });
} else if (await exists(publicDir)) {
  // If nitro is enabled, Nitro built client files to .output/public
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  for (const entry of await readdir(publicDir, { withFileTypes: true })) {
    await cp(resolve(publicDir, entry.name), resolve(distDir, entry.name), { recursive: true });
  }
} else {
  console.log("No build output directory found to copy static assets from.");
}
