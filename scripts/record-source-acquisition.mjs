import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const usage = `Usage:\n  node scripts/record-source-acquisition.mjs --source-id <id> --url <url> --file <relative-path> --role <role> --rights <status> --review <status> [--recorded-at YYYY-MM-DD] [--notes <text>]`;
if (process.argv.includes("--help")) {
  console.log(usage);
  process.exit(0);
}
const args = Object.create(null);
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (!key?.startsWith("--") || value === undefined) {
    console.error(usage);
    process.exit(1);
  }
  args[key.slice(2)] = value;
}
for (const required of ["source-id", "url", "file", "role", "rights", "review"]) {
  if (!args[required]) {
    console.error(`Missing --${required}\n${usage}`);
    process.exit(1);
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.resolve(root, args.file);
const relativePath = path.relative(root, sourcePath);
if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
  throw new Error("--file must resolve inside the repository");
}
const content = await readFile(sourcePath);
const sha256 = createHash("sha256").update(content).digest("hex");
const recordedAt = args["recorded-at"] || new Date().toISOString().slice(0, 10);
const logPath = path.join(root, "data/source-acquisition-log.json");
const log = JSON.parse(await readFile(logPath, "utf8"));
const serial = String((log.records?.length || 0) + 1).padStart(3, "0");
const record = {
  id: `SRC-${recordedAt.replaceAll("-", "")}-${serial}`,
  recordedAt,
  action: "downloaded",
  sourceId: args["source-id"],
  sourceUrl: args.url,
  localPath: relativePath,
  sha256,
  contentRole: args.role,
  rightsStatus: args.rights,
  reviewStatus: args.review
};
if (args.notes) record.notes = args.notes;
log.records = [...(log.records || []), record];
await writeFile(logPath, `${JSON.stringify(log, null, 2)}\n`);
console.log(`Recorded ${record.id}: ${relativePath}`);
