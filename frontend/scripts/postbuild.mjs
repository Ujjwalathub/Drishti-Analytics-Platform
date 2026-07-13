import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(rootDir, ".output", "public");
const distDir = resolve(rootDir, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const entry of await readdir(publicDir, { withFileTypes: true })) {
	await cp(resolve(publicDir, entry.name), resolve(distDir, entry.name), { recursive: true });
}
