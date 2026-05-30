// Build step: embed the built CSS into a TypeScript module
// so no filesystem reads are needed at runtime on Vercel.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cssPath = join(import.meta.dir, "..", "public", "styles", "globals.css");
const outPath = join(import.meta.dir, "styles", "embed.ts");

const css = readFileSync(cssPath, "utf-8");
const escaped = css.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");

writeFileSync(outPath, `export const EMBEDDED_CSS = \`${escaped}\`;\n`);
console.log("CSS embedded to src/styles/embed.ts");
