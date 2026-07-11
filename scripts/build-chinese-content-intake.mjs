import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const course = JSON.parse(await readFile(path.join(root, "data/hanlin-114.json"), "utf8"));
const chinese = course.subjects.find(subject => subject.id === "chinese");
if (!chinese || chinese.units.length !== 12) throw new Error("找不到 12 課國語目錄");

const clean = value => value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const sources = [];
const units = [];

for (const [index, unit] of chinese.units.entries()) {
  const sequence = index + 1;
  const textNameId = `01010211401${String(sequence).padStart(2, "0")}`;
  const sourceFile = path.join(root, "source/official/education-cloud", `ch-${String(sequence).padStart(2, "0")}.html`);
  const html = await readFile(sourceFile, "utf8");
  const title = clean(html.match(/生字詞彙表：([^<\n]+)/)?.[1] || "").replace(/^第[一二三四五六七八九十]+課：/, "");
  const sourceTerms = { "生字": [], "認讀字": [], "語詞": [] };
  const rowPattern = /<tr>([\s\S]*?)<\/tr>/g;
  for (const row of html.matchAll(rowPattern)) {
    const kind = clean(row[1].match(/<span>(生字|認讀字|語詞)<\/span>/)?.[1] || "");
    const term = clean(row[1].match(/class="word_class"[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)?.[1] || "");
    if (kind && term && sourceTerms[kind]) sourceTerms[kind].push(term);
  }
  const termCount = Object.values(sourceTerms).reduce((sum, terms) => sum + terms.length, 0);
  if (!title || termCount === 0) throw new Error(`第 ${sequence} 課教育雲來源無法解析`);
  if (title !== unit.title) throw new Error(`第 ${sequence} 課標題不一致：目錄「${unit.title}」，教育雲「${title}」`);
  const sourceUrl = `https://pedia.cloud.edu.tw/Bookmark/TCollection?TextNameId=${textNameId}`;
  sources.push({ id: `educloud-ch-${String(sequence).padStart(2, "0")}`, type: "official-public-word-bank", localPath: path.relative(root, sourceFile), url: sourceUrl, status: "fetched-and-parsed" });
  units.push({
    publisherUnitId: unit.id,
    sequence,
    officialTitle: title,
    sourceUrl,
    sourceTerms,
    sourceTermCount: termCount,
    titleStatus: "verified",
    wordBankStatus: "verified-public-source",
    textStructureStatus: "needs-licensed-text-or-teacher-review",
    originalTeachingLayerStatus: "needs-unit-review",
    notebookArtifactStatus: "not-started"
  });
}

const intake = {
  schemaVersion: 1,
  metadata: {
    academicYear: 114,
    publisher: "hanlin",
    grade: 2,
    semester: 1,
    subject: "chinese",
    reviewedAt: new Date().toISOString().slice(0, 10),
    reviewStatus: "titles-and-public-word-banks-verified"
  },
  sourcePolicy: {
    publicWebsite: "Only original teaching summaries, activities, and public word-bank references may be published.",
    notebookLM: "Upload only verified and legally usable source packs; do not infer or recreate textbook prose.",
    textbookText: "Requires licensed source or teacher-provided material and human review before use."
  },
  sources: [
    { id: "educloud-index", type: "official-public-word-bank-index", localPath: "source/official/education-cloud-hanlin-grade2-chinese-114.html", url: "https://pedia.cloud.edu.tw/Bookmark/Textword?category=%E5%9C%8B%E8%AA%9E&degree=2&press=%E7%BF%B0%E6%9E%97%E7%89%88&year=114_1", status: "fetched-and-parsed" },
    { id: "school-plan", type: "public-school-curriculum-plan", localPath: "source/official/hanlin-grade2-chinese-114-spps-plan.md", url: "https://web.spps.tp.edu.tw/uploads/1756199556141pTG3MWbx.pdf", status: "fetched-and-converted" },
    ...sources
  ],
  units
};

await mkdir(path.join(root, "data/content-intake"), { recursive: true });
await writeFile(path.join(root, "data/content-intake/chinese-hanlin-114.json"), `${JSON.stringify(intake, null, 2)}\n`);
console.log(`built ${units.length} verified Chinese lesson intake records`);
