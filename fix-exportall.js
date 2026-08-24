const fs = require("fs");
const path = require("path");
const glob = require("glob");

const exportAllFunc =
  "var __exportAll = (all, no_symbols) => { let target = {}; for (var name in all) Object.defineProperty(target, name, { get: all[name], enumerable: true }); if (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: 'Module' }); return target; };";

const files = glob.sync(".vercel/output/functions/__server.func/_ssr/server-*.mjs");
console.log("Fixing Rolldown __exportAll circular dependency in:", files.length, "files");

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes("import { n as __exportAll }")) {
    content = content.replace(
      /import\s+\{\s*n\s+as\s+__exportAll\s*\}\s+from\s+['"][^'"]+['"];/,
      exportAllFunc,
    );
    fs.writeFileSync(file, content);
    console.log("Patched __exportAll in", file);
  }
}
