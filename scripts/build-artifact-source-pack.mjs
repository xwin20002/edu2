import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const intakePath = path.join(root, "data/content-intake/math-kanghsuan-115.json");
const intake = JSON.parse(await readFile(intakePath, "utf8"));

if (intake.sourceStatus !== "official-outline-verified-all-units-publication-ready-human-confirmed") {
  throw new Error(`math intake is not artifact-ready: ${intake.sourceStatus}`);
}

const sections = [];
for (const item of intake.units) {
  if (item.contentStatus !== "publication-ready-human-confirmed") {
    throw new Error(`${item.publisherUnitId} is not human-confirmed`);
  }
  const briefPath = path.join(root, item.unitBrief);
  const brief = JSON.parse(await readFile(briefPath, "utf8"));
  if (brief.sourceStatus !== "unit-brief-verified-exact-year") {
    throw new Error(`${brief.unitId} is not exact-year verified`);
  }
  const unit = brief.unit;
  const ext = unit.mathExtension;
  const representations = (ext.representations || []).map(value => {
    const label = value.label || value.type;
    return `- ${label}：${value.description || value.purpose}`;
  }).join("\n");
  const examples = (ext.workedExamples || []).map(value => {
    const prompt = value.prompt || value.problem || value.title;
    return `- 題意：${prompt}\n  - 解法：${value.solution || value.answer}\n  - 檢查／理由：${value.check || value.reasoning}`;
  }).join("\n");
  const misconceptions = (ext.misconceptions || []).map(value => `- 誤解：${value.claim}\n  - 修正：${value.correction}`).join("\n");
  sections.push(`## ${brief.unitId} ${brief.title}\n\n### 學習焦點\n\n${unit.focus}\n\n### 學習目標\n\n${unit.objectives.map(value => `- ${value}`).join("\n")}\n\n### 原創課堂任務\n\n${unit.mission}\n\n### 原創表徵\n\n${representations}\n\n### 原創 worked example\n\n${examples}\n\n### 分步推理\n\n${ext.reasoningSteps.map((value, index) => `${index + 1}. ${value}`).join("\n")}\n\n### 常見迷思\n\n${misconceptions}\n\n### 本單元來源邊界\n\n${brief.sourceBoundary}`);
}

const sources = intake.sources.map(source => `- ${source.id}: ${source.url}\n  - evidence pages: ${(source.evidencePages || []).join(", ")}\n  - rights: ${source.rightsStatus}`).join("\n");
const output = `# edu2 小二上數學｜康軒 115｜NotebookLM subject source pack\n\n- Target academic year: 115\n- Grade / semester: 2 / 1\n- Publisher: 康軒\n- Scope: U01–U10 subject overview\n- Content gate: publication-ready-human-confirmed-all-units\n- Generated from committed structured briefs; do not treat this pack as publisher textbook content.\n\n## 生成指引\n\n請製作適合臺灣國小二年級的數學教學簡報。每個單元清楚呈現學習焦點、生活情境、具體表徵、一步一步推理、常見迷思與一個簡短自我檢核。使用繁體中文、短句、大字、低文字密度；所有數學敘述必須忠於本 source pack。不得聲稱內容、題目或圖片來自康軒課本；不得補寫本 source pack 未提供的出版社內容。\n\n## 公開來源與權利邊界\n\n${sources}\n\n公開來源只用來核對單元順序與學習範圍。以下任務、數字、例題、表徵、提示與評量均為 edu2 原創；不得加入或模仿課本頁面、習作題、教師手冊、出版社插圖或第三方影音。\n\n${sections.join("\n\n---\n\n")}\n`;

const outputPath = path.join(root, "sources/notebooklm/115/math-kanghsuan-115.md");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, output, "utf8");
console.log(path.relative(root, outputPath));
