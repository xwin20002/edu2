import {access, readFile} from "node:fs/promises";
import process from "node:process";

const errors = [];
const read = path => readFile(new URL(`../${path}`, import.meta.url), "utf8");

let catalog;
try {
  catalog = JSON.parse(await read("data/catalog.json"));
} catch (error) {
  errors.push(`data/catalog.json 無法解析：${error.message}`);
}

if (catalog) {
  const publisherIds = new Set(catalog.publishers?.map(item => item.id));
  if (!publisherIds.has(catalog.project?.defaultPublisher)) errors.push("defaultPublisher 不存在於 publishers");
  if (!catalog.publishers?.some(item => item.status === "baseline")) errors.push("缺少 baseline publisher");
  if ((catalog.publishers || []).length < 2) errors.push("未保留第二出版社切換位置");
  for (const subject of catalog.subjects || []) {
    if (!subject.id || !subject.label) errors.push("subject 缺少 id 或 label");
    if (subject.status !== "ready" && subject.href !== null) errors.push(`${subject.id}: 未達 ready 但 href 已啟用`);
    if (subject.status === "ready" && !subject.href) errors.push(`${subject.id}: ready 但缺少 href`);
    if (subject.status === "ready" && subject.href) {
      try { await access(new URL(`../${subject.href}`, import.meta.url)); }
      catch { errors.push(`${subject.id}: href 目標不存在 (${subject.href})`); }
    }
  }
}

try {
  const hanlin = JSON.parse(await read("data/hanlin-114.json"));
  const expected = {chinese: 12, math: 10, life: 6};
  for (const [id, count] of Object.entries(expected)) {
    const actual = hanlin.subjects?.find(subject => subject.id === id)?.units?.length;
    if (actual !== count) errors.push(`hanlin-114 ${id} 單元數錯誤：預期 ${count}，實際 ${actual}`);
  }
} catch (error) {
  errors.push(`data/hanlin-114.json 無法解析：${error.message}`);
}

const homepage = await read("index.html");
const legacyPatterns = [/三年級/,/三下/,/href=["'](?:chinese\.html|math\/|science\/|L\d)/];
for (const pattern of legacyPatterns) {
  if (pattern.test(homepage)) errors.push(`首頁仍含舊教材內容：${pattern}`);
}
if (!homepage.includes("publisher-select")) errors.push("首頁缺少 publisher selector");
if (!homepage.includes("compare-view")) errors.push("首頁缺少 comparison view");

for (const template of ["data/templates/intake.template.json", "data/templates/publisher-mapping.template.json"]) {
  try {
    JSON.parse(await read(template));
  } catch (error) {
    errors.push(`${template} 無法解析：${error.message}`);
  }
}

if (errors.length) {
  console.error("Foundation validation: FAIL");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Foundation validation: PASS");
