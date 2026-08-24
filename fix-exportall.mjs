import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportAllFunc =
  "var __exportAll = (all, no_symbols) => { let target = {}; for (var name in all) Object.defineProperty(target, name, { get: all[name], enumerable: true }); if (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: 'Module' }); return target; };";

const dir = path.join(__dirname, ".vercel", "output", "functions", "__server.func", "_ssr");
if (!fs.existsSync(dir)) {
  console.log("Dir not found, trying .output...");
  const dir2 = path.join(__dirname, ".output", "server", "_ssr");
  if (fs.existsSync(dir2)) {
    patchDir(dir2);
  }
} else {
  patchDir(dir);
}

function patchDir(dirPath) {
  const files = fs
    .readdirSync(dirPath)
    .filter((f) => f.startsWith("server-") && f.endsWith(".mjs"));
  console.log(
    "Fixing Rolldown __exportAll circular dependency in:",
    files.length,
    "files in",
    dirPath,
  );

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, "utf8");
    if (content.includes("import { n as __exportAll }") || content.includes("import {")) {
      // Just safely replace the import
      content = content.replace(
        /import\s+\{\s*n\s+as\s+__exportAll\s*\}\s+from\s+['"][^'"]+['"];/g,
        exportAllFunc,
      );
      fs.writeFileSync(filePath, content);
      console.log("Patched __exportAll in", file);
    }
  }
}
