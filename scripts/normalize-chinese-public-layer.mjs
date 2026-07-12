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
// Full L01 習寫生字 (18) with context-verified zhuyin from the education-cloud word bank.
// Readings follow the L01「我的心情」weather context (e.g. 難→ㄋㄢˊ in 難過).
// Human/teacher review recommended before classroom use, especially multi-tone characters.
// Legal reading layer: official audio link + original listening-guided tasks.
// These tasks direct pupils to the official recording and use only verified public
// vocabulary; they do NOT reproduce or assert the copyrighted lesson prose.
l01.readingGuide = {
  audioUrl: "https://player.hle.com.tw/ech/playlist.html?volume=二上&unit=L1",
  audioLabel: "翰林聆聽・二上第一課〈我的心情〉課本音檔（官方朗讀）",
  audioBoundary: "官方朗讀僅供購買相關教材者學習使用；本站只提供播放連結，不下載、嵌入或重製音檔。",
  listeningTasks: [
    "第一次聽：用耳朵找出課文裡出現的「天氣」詞語（例如：烏雲密布、傾盆大雨、放晴、彩虹）。",
    "第二次聽：注意天氣是怎麼變化的？把你聽到的先後順序排出來。",
    "第三次聽：想一想——課文裡的心情和天氣的變化有什麼關係？用一句完整的話說說看。",
    "生活延伸：你也有像天氣一樣會變的心情嗎？舉一個自己的例子，用完整句表達。"
  ],
  textPlaceholderNote: "課文本文（逐字直式）尚未貼入。老師取得合法課文文字後貼入，即可自動排成直式＋逐字注音的閱讀區。"
};
l01.characters = [
  { char: "候", zhuyin: "ㄏㄡˋ" },
  { char: "颳", zhuyin: "ㄍㄨㄚ" },
  { char: "冷", zhuyin: "ㄌㄥˇ" },
  { char: "躲", zhuyin: "ㄉㄨㄛˇ" },
  { char: "閃", zhuyin: "ㄕㄢˇ" },
  { char: "電", zhuyin: "ㄉㄧㄢˋ" },
  { char: "難", zhuyin: "ㄋㄢˊ" },
  { char: "烏", zhuyin: "ㄨ" },
  { char: "雲", zhuyin: "ㄩㄣˊ" },
  { char: "密", zhuyin: "ㄇㄧˋ" },
  { char: "布", zhuyin: "ㄅㄨˋ" },
  { char: "盆", zhuyin: "ㄆㄣˊ" },
  { char: "充", zhuyin: "ㄔㄨㄥ" },
  { char: "滿", zhuyin: "ㄇㄢˇ" },
  { char: "放", zhuyin: "ㄈㄤˋ" },
  { char: "晴", zhuyin: "ㄑㄧㄥˊ" },
  { char: "現", zhuyin: "ㄒㄧㄢˋ" },
  { char: "虹", zhuyin: "ㄏㄨㄥˊ" }
];

// L02-L12 legal reading layer: same pattern as L01 — official audio link (URL pattern
// verified against player.hle.com.tw for L1/L2/L7/L12, titles match our unit list exactly)
// plus original listening-guided tasks grounded only in each unit's verified education-cloud
// vocabulary. Tasks never assert plot, character actions, or sequence as textbook fact —
// they ask pupils to discover order/meaning themselves while listening to the real recording.
const readingGuideBoundary = "官方朗讀僅供購買相關教材者學習使用；本站只提供播放連結，不下載、嵌入或重製音檔。";
const readingGuidePlaceholder = "課文本文（逐字直式）尚未貼入。老師取得合法課文文字後貼入，即可自動排成直式＋逐字注音的閱讀區。";
const readingGuides = [
  null, // L01 already set above
  { // L02 彩色的天空
    themeWords: "希望、緊張、不熟",
    tasks: [
      "第一次聽：用耳朵找出跟「學新事情的心情」有關的詞語（例如：希望、緊張、不熟）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「彩色的天空」這個課名，跟主角學習時的心情可能有什麼關聯？用一句完整話說說看。",
      "生活延伸：你學一件新事情（例如騎腳踏車、游泳）的時候，會不會也覺得緊張？舉一個自己的例子，用完整句表達。"
    ]
  },
  { // L03 國王做新衣
    themeWords: "國王、大臣、設計",
    tasks: [
      "第一次聽：用耳朵找出跟「人物」有關的詞語（例如：國王、大臣）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「設計」和「驚喜」這兩個詞，在故事裡可能有什麼關係？用一句完整話說說看。",
      "生活延伸：如果你要為家人設計一個驚喜，你會怎麼做？用完整句分享你的方法。"
    ]
  },
  { // L04 水草下的呱呱
    themeWords: "呱呱、青蛙、蝦蟆",
    tasks: [
      "第一次聽：用耳朵找出跟「聲音與動物」有關的詞語（例如：呱呱、青蛙、蝦蟆）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「靠近」和「擔心」這兩個詞，可能是誰對誰的動作或心情？用一句完整話說說看。",
      "生活延伸：你有沒有聽過奇怪的聲音，好奇是誰發出的？用完整句說說你的經驗。"
    ]
  },
  { // L05 沙灘上的畫
    themeWords: "沙灘、海邊、夕陽",
    tasks: [
      "第一次聽：用耳朵找出跟「海邊景色」有關的詞語（例如：沙灘、海邊、夕陽、螃蟹）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「腳印」為什麼會留在沙灘上？用一句完整話說說你的想法。",
      "生活延伸：你有沒有在沙灘或泥地上留下腳印的經驗？用完整句分享。"
    ]
  },
  { // L06 草叢裡的星星
    themeWords: "奶奶、晚飯、散步",
    tasks: [
      "第一次聽：用耳朵找出跟「夜晚散步」有關的詞語（例如：奶奶、晚飯、散步、竹林）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，草叢裡「像星星」的東西可能是什麼？用一句完整話說出你的猜想。",
      "生活延伸：你有沒有和家人一起散步、觀察夜晚景色的經驗？用完整句分享。"
    ]
  },
  { // L07 不一樣的美食
    themeWords: "美食、艾粄、清明節",
    tasks: [
      "第一次聽：用耳朵找出跟「食物與節日」有關的詞語（例如：美食、艾粄、清明節、客家人）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「艾粄」跟「清明節」、「祖先」可能有什麼關係？用一句完整話說說看。",
      "生活延伸：你們家有沒有特別節日才吃的食物？用完整句介紹一種。"
    ]
  },
  { // L08 美食分享日
    themeWords: "介紹、食材、青菜",
    tasks: [
      "第一次聽：用耳朵找出跟「介紹食物」有關的詞語（例如：介紹、食材、米線、青菜）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「舉手」在課文裡可能是要做什麼？用一句完整話說說看。",
      "生活延伸：如果換你上台介紹一種食物，你會先說什麼？用完整句練習看看。"
    ]
  },
  { // L09 好味道
    themeWords: "海苔、蔬菜、淡淡",
    tasks: [
      "第一次聽：用耳朵找出跟「味道與烹煮」有關的詞語（例如：海苔、蔬菜、淡淡、細心）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「淡淡」的味道是什麼樣的感覺？用一句完整話形容看看。",
      "生活延伸：你最喜歡的味道是什麼？用完整句描述給同學聽。"
    ]
  },
  { // L10 加加減減
    themeWords: "字謎、回答、異口同聲",
    tasks: [
      "第一次聽：用耳朵找出跟「猜字謎」有關的詞語（例如：字謎、回答、異口同聲）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「異口同聲」是什麼意思？在什麼情況下大家會異口同聲說話？用一句完整話說說看。",
      "生活延伸：你玩過猜字謎或猜謎語的遊戲嗎？用完整句分享一次經驗。"
    ]
  },
  { // L11 奇怪的門
    themeWords: "奇怪、發慌、竟然",
    tasks: [
      "第一次聽：用耳朵找出跟「奇怪與驚訝」有關的詞語（例如：奇怪、發慌、竟然、妖怪）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：想一想，「這扇奇怪的門」後面可能發生了什麼事？用一句完整話說出你的猜想。",
      "生活延伸：如果你打開一扇神秘的門，你希望看到什麼？用完整句分享你的想像。"
    ]
  },
  { // L12 詠鵝 — vocabulary includes 翻跟頭/倒立/肚皮, so this unit is a modern lesson that
    // references the well-known Tang-dynasty poem《詠鵝》(駱賓王), not the ancient poem verbatim.
    // Tasks stay grounded in verified vocabulary only; the classical poem itself is public domain
    // general knowledge and is noted as optional supplementary context, not asserted as the lesson text.
    themeWords: "詩人、伸長、脖子",
    tasks: [
      "第一次聽：用耳朵找出跟「鵝的動作」有關的詞語（例如：伸長、脖子、翻跟頭、倒立）。",
      "第二次聽：選兩個你聽到的詞語，說說看它們在故事裡誰先出現、誰後出現。",
      "第三次聽：這一課提到「詩人」，你知道有一首很有名的古詩也叫〈詠鵝〉嗎？（作者駱賓王，是公共領域的千年古詩，可另外請教師補充；本站不代為引用課文版本。）",
      "生活延伸：如果請你用動作表演一隻鵝，你會怎麼伸長脖子、怎麼走路？用完整句說說你的表演方式。"
    ]
  }
];

chinese.units.forEach((unit, index) => {
  if (index === 0) return; // L01 handled above with its own audioLabel/title text
  const guide = readingGuides[index];
  if (!guide) return;
  unit.readingGuide = {
    audioUrl: `https://player.hle.com.tw/ech/playlist.html?volume=二上&unit=L${index + 1}`,
    audioLabel: `翰林聆聽・二上第${index + 1}課〈${unit.title}〉課本音檔（官方朗讀）`,
    audioBoundary: readingGuideBoundary,
    listeningTasks: guide.tasks,
    textPlaceholderNote: readingGuidePlaceholder
  };
});

await writeFile(target, `${JSON.stringify(course, null, 2)}\n`);
console.log("normalized 12 Chinese units to the verified public learning layer");
