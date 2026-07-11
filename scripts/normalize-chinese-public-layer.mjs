import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "data/hanlin-114.json");
const course = JSON.parse(await readFile(target, "utf8"));
const chinese = course.subjects?.find(subject => subject.id === "chinese");

if (!chinese || chinese.units?.length !== 12) {
  throw new Error("找不到翰林 114 小二上國語 12 課目錄");
}

const publicFocus = "辨識本課已核對詞彙，練習中文朗讀並以完整句表達。";
const publicMission = "從已核對詞彙選兩個，先朗讀，再各用自己的話造一句完整句。";

for (const unit of chinese.units) {
  unit.focus = publicFocus;
  unit.mission = publicMission;
  unit.publicLearningLayerStatus = "ready-wordbank-and-listening";
  unit.textStructureStatus = "needs-licensed-text-or-teacher-review";
  unit.contentBoundary = "課文事件、人物、段落與理解題尚未有合法 text-structure brief；不可由課名或詞彙推測。";
}

// L01 retains the lower-primary Chinese renderer Golden, but labels its text as an
// original vertical reading exercise rather than a claim about the textbook prose.
const l01 = chinese.units[0];
l01.verticalSummary = "選一個已核對詞彙，依「詞語、自己的例句」練習直式朗讀；本區是原創朗讀練習，不是課文本文。";
l01.vocabulary = [
  { word: "烏雲密布", meaning: "已核對公開詞彙；請到教育雲查看釋義。" },
  { word: "放晴", meaning: "已核對公開詞彙；請到教育雲查看釋義。" },
  { word: "彩虹", meaning: "已核對公開詞彙；請到教育雲查看釋義。" }
];
l01.characters = [
  { char: "颳", zhuyin: "ㄍㄨㄚ" },
  { char: "雲", zhuyin: "ㄩㄣˊ" },
  { char: "晴", zhuyin: "ㄑㄧㄥˊ" },
  { char: "虹", zhuyin: "ㄏㄨㄥˊ" }
];

await writeFile(target, `${JSON.stringify(course, null, 2)}\n`);
console.log("normalized 12 Chinese units to the verified public learning layer");
