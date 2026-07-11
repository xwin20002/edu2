import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(await readFile(path.join(root, "data/hanlin-114.json"), "utf8"));
const output = path.join(root, "sources/notebooklm");
await mkdir(output, {recursive: true});
const chineseIntake = JSON.parse(await readFile(path.join(root, "data/content-intake/chinese-hanlin-114.json"), "utf8"));
const chineseIntakeByUnit = new Map(chineseIntake.units.map(unit => [unit.publisherUnitId, unit]));

const boundaries = `
## 使用與版權邊界

- 本文件只整理公開課程目錄、公開學習目標與本站原創教學任務。
- 不包含、不重製翰林課文全文、習題、教師手冊或付費教材內容。
- NotebookLM 產出需使用繁體中文，對象為臺灣國小二年級學生與教師。
- 若產出提及課文細節，必須標記「請搭配合法課本核對」，不得自行補寫原課文。
`;

for (const subject of data.subjects) {
  const unitType = subject.id === "chinese" ? "課" : subject.id === "life" ? "主題" : "單元";
  const units = subject.units.map((unit, index) => {
    const draftLabel = subject.id === "chinese" ? "（本站原創草稿，需 source review）" : "";
    const base = `### 第 ${index + 1} ${unitType}｜${unit.title}\n\n- 學習焦點${draftLabel}：${unit.focus}\n- 原創課堂任務${draftLabel}：${unit.mission}`;
    if (subject.id !== "chinese") return base;
    const intake = chineseIntakeByUnit.get(unit.id);
    if (!intake) throw new Error(`缺少國語 ${unit.id} intake`);
    return `${base}\n- 官方詞彙來源：${intake.sourceUrl}\n- 生字（教育雲公開詞彙表）：${intake.sourceTerms["生字"].join("、")}\n- 認讀字（教育雲公開詞彙表）：${intake.sourceTerms["認讀字"].join("、")}\n- 語詞（教育雲公開詞彙表）：${intake.sourceTerms["語詞"].join("、")}\n- 課文結構狀態：${intake.textStructureStatus}。不可依題名或詞表補寫故事情節。`;
  }).join("\n\n");
  const sourceList = data.sources.map(source => `- ${source.label}：${source.url}`).join("\n");
  const markdown = `# 翰林版 114 學年度國小二年級上學期｜${subject.label}教學素材基礎\n\n## 文件目的\n\n本文件供 edu2 NotebookLM 建立授課簡報、資訊圖表、學習卡、測驗與學生自學影片。內容是經公開來源核對的課程骨架，以及 edu2 專案原創活動。\n\n## 課程定位\n\n${subject.intro}\n\n${units}\n\n## 建議產出規格\n\n1. 授課簡報：16:9、12-15頁、每頁一個重點、文字精簡、適合投影。\n2. 資訊圖表：16:9、繁體中文、大字、呈現全冊學習地圖與常見迷思。\n3. 學習卡：每${unitType}至少2張，正面是問題，背面是簡短提示與答案。\n4. 測驗：難度由記憶、理解到應用；避免引用課文全文。\n5. 學生自學影片：5-8分鐘、溫暖活潑、使用二年級可理解語言，提醒搭配合法課本。\n${boundaries}\n## 公開來源\n\n${sourceList}\n`;
  const file = path.join(output, `${subject.id}-hanlin-114.md`);
  await writeFile(file, markdown);
  console.log(`built ${path.relative(root, file)}`);

  if (subject.id === "chinese") {
    const chineseOutput = path.join(output, "chinese");
    await mkdir(chineseOutput, {recursive: true});
    for (const [index, unit] of subject.units.entries()) {
      const intake = chineseIntakeByUnit.get(unit.id);
      const pack = `# 翰林版 114 學年度國小二年級上學期｜第 ${index + 1} 課 ${unit.title}\n\n## 已驗證來源\n\n- 教育雲詞彙表：${intake.sourceUrl}\n- 課名：${intake.officialTitle}\n- 來源狀態：${intake.titleStatus}；${intake.wordBankStatus}\n\n## 官方公開詞彙 bank\n\n- 生字：${intake.sourceTerms["生字"].join("、")}\n- 認讀字：${intake.sourceTerms["認讀字"].join("、")}\n- 語詞：${intake.sourceTerms["語詞"].join("、")}\n\n## NotebookLM 產出邊界\n\n- 可以依這些已驗證詞彙，提出識字、詞義、造句、朗讀與原創情境活動。\n- 不得由課名、詞彙或既有草稿推測／重寫課文全文、故事事件、人物關係、習題或教師手冊內容。\n- 若要生成逐課簡報、字卡、測驗或影片，必須先補入合法課文摘要或教師核對過的 text-structure brief。\n\n## 目前網站草稿（非教材事實）\n\n- 學習焦點：${unit.focus}\n- 原創課堂任務：${unit.mission}\n- review status：needs-unit-review\n`;
      const lessonFile = path.join(chineseOutput, `L${String(index + 1).padStart(2, "0")}-${unit.id}.md`);
      await writeFile(lessonFile, pack);
      console.log(`built ${path.relative(root, lessonFile)}`);
    }
  }
}

const overview = `# edu2 小二上教學駕駛艙｜NotebookLM 總覽來源\n\n## 目標\n\n建立達到 edu3 基準的完整教學駕駛艙：國語、數學、生活三科皆具備授課簡報、資訊圖表、學習卡、測驗、學生自學影片、教師提示與互動活動。\n\n## 科目\n\n${data.subjects.map(subject => `- ${subject.label}：${subject.units.length} 個${subject.id === "chinese" ? "課次" : subject.id === "life" ? "主題" : "單元"}`).join("\n")}\n\n## 跨科設計原則\n\n- 使用繁體中文與臺灣用語。\n- 適合二年級學生，句子短、圖像優先、一次一個概念。\n- 教師區需包含 Bloom 記憶／理解／應用三層問題與常見迷思。\n- 學生區需包含可立即操作的任務與自我檢核。\n- 不重製受版權保護的課文或題本。\n- 所有事實以來源為準；來源不足時明確標示，不推測。\n${boundaries}`;
await writeFile(path.join(output, "00-overview.md"), overview);
console.log("built sources/notebooklm/00-overview.md");
