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
    const subject = hanlin.subjects?.find(item => item.id === id);
    const actual = subject?.units?.length;
    if (actual !== count) errors.push(`hanlin-114 ${id} 單元數錯誤：預期 ${count}，實際 ${actual}`);
    for (const [index, unit] of (subject?.units || []).entries()) {
      const prefix = id === "chinese" ? "L" : id === "math" ? "U" : "T";
      const unitFolder = `${prefix}${String(index + 1).padStart(2, "0")}`;
      const folder = id === "chinese" ? `chinese/${unitFolder}` : `${id}/${unitFolder}`;
      try { await access(new URL(`../${folder}/index.html`, import.meta.url)); }
      catch { errors.push(`${id} ${unit.id}: 單元頁不存在`); }
    }
  }
} catch (error) {
  errors.push(`data/hanlin-114.json 無法解析：${error.message}`);
}

const homepage = await read("index.html");
const foundationPage = await read("foundation.html");
const legacyPatterns = [/三年級/,/三下/,/href=["'](?:chinese\.html|math\/|science\/|L\d)/];
for (const pattern of legacyPatterns) {
  if (pattern.test(homepage)) errors.push(`首頁仍含舊教材內容：${pattern}`);
}
if (!homepage.includes("publisher-select")) errors.push("首頁缺少 publisher selector");
if (!homepage.includes("compare-view")) errors.push("首頁缺少 comparison view");
if (!foundationPage.includes("Milestone A")) errors.push("foundation.html 缺少 Milestone A 定義");
if (!foundationPage.includes("Milestone B")) errors.push("foundation.html 缺少 Milestone B 邊界");

for (const template of ["data/templates/intake.template.json", "data/templates/publisher-mapping.template.json", "data/templates/unit-content.template.json"]) {
  try {
    JSON.parse(await read(template));
  } catch (error) {
    errors.push(`${template} 無法解析：${error.message}`);
  }
}

const unitCss = await read("assets/css/unit.css");
const chineseExample = await read("chinese/L01/index.html");
if (!unitCss.includes("writing-mode:vertical-rl")) errors.push("國語直式導讀缺少 vertical-rl");
if (/(?:^|[;{])\s*direction\s*:/.test(unitCss)) errors.push("國語直式樣式不得加入 direction");
if (chineseExample.includes("<ruby")) errors.push("國語注音不得使用 ruby");
if (!chineseExample.includes("zy-tone")) errors.push("國語注音範例缺少聲調定位");

try {
  const manifest = JSON.parse(await read("data/artifact-manifest.json"));
  if (manifest.notebook?.account !== "xwin20002@gmail.com") errors.push("NotebookLM account 不是 xwin20002@gmail.com");
  for (const artifact of manifest.artifacts || []) {
    if (artifact.path) {
      try { await access(new URL(`../${artifact.path}`, import.meta.url)); }
      catch { errors.push(`${artifact.id}: artifact path 不存在 (${artifact.path})`); }
    }
  }
} catch (error) {
  errors.push(`data/artifact-manifest.json 無法解析：${error.message}`);
}

for (let index = 1; index <= 13; index += 1) {
  const slide = `assets/notebooklm/slides/slide-${String(index).padStart(2, "0")}.jpg`;
  try { await access(new URL(`../${slide}`, import.meta.url)); }
  catch { errors.push(`NotebookLM web slide 不存在：${slide}`); }
}

if (errors.length) {
  console.error("Foundation validation: FAIL");
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Foundation validation: PASS");
