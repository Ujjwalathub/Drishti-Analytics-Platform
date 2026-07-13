import { cp, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(rootDir, ".output");
const distDir = resolve(rootDir, "dist");

await rm(distDir, { recursive: true, force: true });
await cp(outputDir, distDir, { recursive: true });
