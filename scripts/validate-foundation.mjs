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

try {
  const golden = JSON.parse(await read("data/golden-samples.json"));
  const expectedGolden = new Set(["chinese", "math", "life"]);
  for (const sample of golden.samples || []) {
    expectedGolden.delete(sample.subject);
    try { await access(new URL(`../${sample.path}`, import.meta.url)); }
    catch { errors.push(`Golden sample 不存在：${sample.path}`); }
    if (!sample.gradeBand || !sample.profile || !sample.requirements) errors.push(`${sample.id}: 缺少 subject-grade profile`);
  }
  if (expectedGolden.size) errors.push(`缺少科目 Golden sample：${[...expectedGolden].join(", ")}`);
  const chineseGolden = golden.samples?.find(sample => sample.subject === "chinese");
  if (chineseGolden?.requirements?.zhuyinPolicy !== "dense") errors.push("小二國語 Golden 必須使用 dense zhuyin policy");
  for (const subject of ["math", "life"]) {
    const sample = golden.samples?.find(item => item.subject === subject);
    if (!sample?.parity?.checklist || !sample?.parity?.status) errors.push(`${subject} Golden 缺少 parity checklist/status`);
  }
  const middleChinese = golden.futureProfiles?.find(profile => profile.profile === "chinese-middle-primary");
  if (middleChinese?.zhuyinPolicy !== "selective") errors.push("中年段國語 profile 必須使用 selective zhuyin policy");
} catch (error) {
  errors.push(`data/golden-samples.json 無法解析：${error.message}`);
}

const homepage = await read("index.html");
const foundationPage = await read("foundation.html");
const workflowPage = await read("workflow.html");
const legacyPatterns = [/三年級/,/三下/,/href=["'](?:chinese\.html|math\/|science\/|L\d)/];
for (const pattern of legacyPatterns) {
  if (pattern.test(homepage)) errors.push(`首頁仍含舊教材內容：${pattern}`);
}
if (!homepage.includes("publisher-select")) errors.push("首頁缺少 publisher selector");
if (!homepage.includes("compare-view")) errors.push("首頁缺少 comparison view");
if (!foundationPage.includes("Milestone A")) errors.push("foundation.html 缺少 Milestone A 定義");
if (!foundationPage.includes("Milestone B")) errors.push("foundation.html 缺少 Milestone B 邊界");
if (!homepage.includes('href="workflow.html"')) errors.push("首頁缺少工作流程分頁入口");
if (!workflowPage.includes("國語 Reference Rules")) errors.push("workflow.html 缺少國語 reference 規則");
if (!workflowPage.includes("vertical-rl")) errors.push("workflow.html 缺少直式規格記錄");
for (const stage of ["架構起始", "重新蒐集資料", "資料處理", "資料換入架構", "技術驗證", "品質確認與舊版對比"]) {
  if (!workflowPage.includes(stage)) errors.push(`workflow.html 缺少六階段流程：${stage}`);
}
if (!workflowPage.includes("Golden Samples")) errors.push("workflow.html 缺少 Golden Samples 區塊");
if (!workflowPage.includes("偏差警報與快速接回")) errors.push("workflow.html 缺少 early-warning／recovery 區塊");
if (!workflowPage.includes("Phase 0 · Reuse／Scope／Continuity Preflight")) errors.push("workflow.html 缺少 reuse／scope／continuity preflight");
if (!workflowPage.includes("scopeClass") || !workflowPage.includes("continuityStatus")) errors.push("workflow.html 缺少 scope／continuity 狀態欄位");
if (!workflowPage.includes("知識成熟循環")) errors.push("workflow.html 缺少 knowledge maturation loop");
try { await access(new URL("../docs/retrospective-2026-07-11.md", import.meta.url)); }
catch { errors.push("缺少本次建置 retrospective"); }
try { await access(new URL("../docs/reuse-map-2026-07-11.md", import.meta.url)); }
catch { errors.push("缺少本次 resumed portfolio reuse map"); }
try { await access(new URL("../docs/golden-parity-math-life-2026-07-11.md", import.meta.url)); }
catch { errors.push("缺少數學／生活 Golden parity checklist"); }
try {
  const registry = JSON.parse(await read("data/source-registry/chinese-lower-primary-114.json"));
  const sourceIds = new Set(registry.sources?.map(source => source.id));
  for (const required of ["education-cloud-hanlin-114-wordbank", "mhps-114-grade2-chinese-plan", "hanlin-listening-e-listen", "hanlin-primary-wordwall", "gsyan-html5-fun-hanlin-grade2-114", "teachersay-wordwall-l01-my-feelings", "edu1-raw-source-index-pattern", "obsidian-l6-chinese-source-layering-sop", "edu3-git-artifact-history", "youtube-discovery-policy"]) {
    if (!sourceIds.has(required)) errors.push(`國語 source registry 缺少 ${required}`);
  }
  if (registry.sources?.find(source => source.id === "gsyan-html5-fun-hanlin-grade2-114")?.licenseStatus !== "unknown-review-required") errors.push("Tier C 教師資源必須保留授權 review gate");
  const log = JSON.parse(await read("data/source-acquisition-log.json"));
  for (const id of ["SRC-20260711-001", "SRC-20260711-002", "SRC-20260711-003", "SRC-20260711-004", "SRC-20260711-005", "SRC-20260711-006", "SRC-20260711-007", "SRC-20260711-008", "SRC-20260711-009", "SRC-20260711-010", "SRC-20260711-011"]) {
    if (!log.records?.some(record => record.id === id)) errors.push(`source acquisition log 缺少 ${id}`);
  }
} catch (error) { errors.push(`source registry 或 acquisition log 無法解析：${error.message}`); }

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
if (!unitCss.includes("text-orientation:mixed")) errors.push("國語直式導讀缺少 mixed orientation");
if (/(?:^|[;{])\s*direction\s*:/.test(unitCss)) errors.push("國語直式樣式不得加入 direction");
if (!unitCss.includes("flex-direction:row-reverse")) errors.push("國語生字排列缺少 row-reverse");
if (chineseExample.includes("<ruby")) errors.push("國語注音不得使用 ruby");
if (!chineseExample.includes("zy-tone")) errors.push("國語注音範例缺少聲調定位");
if (!chineseExample.includes('<span class="zy-row">ㄥ<span class="zy-tone">ˊ</span>')) errors.push("國語注音聲調未放在末符號右側");

try {
  const manifest = JSON.parse(await read("data/artifact-manifest.json"));
  if (manifest.notebook?.account !== "xwin20002@gmail.com") errors.push("NotebookLM account 不是 xwin20002@gmail.com");
  if (manifest.artifacts?.find(item => item.id === "overview-video")?.scope !== "all-subject-overview-not-unit") errors.push("overview video 必須標為全冊導覽，不得視為逐課影片");
  if (manifest.unitArtifacts?.status !== "not-started") errors.push("unit artifact 狀態需由逐課產製流程更新");
  try {
    const intake = JSON.parse(await read("data/content-intake/chinese-hanlin-114.json"));
    if (intake.units?.length !== 12) errors.push("國語 content intake 必須有 12 課");
    for (const unit of intake.units || []) {
      if (unit.titleStatus !== "verified" || unit.wordBankStatus !== "verified-public-source" || !unit.sourceTermCount) errors.push(`${unit.publisherUnitId}: 國語 source intake 不完整`);
    }
  } catch (error) { errors.push(`國語逐課 content intake 無法解析：${error.message}`); }
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
