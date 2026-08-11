import {readFile, writeFile, mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetVersion = "20260810-golden-3";
const data = JSON.parse(await readFile(path.join(root, "data/hanlin-114.json"), "utf8"));
const esc = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]);
const chineseIntake = JSON.parse(await readFile(path.join(root, "data/content-intake/chinese-hanlin-114.json"), "utf8"));
const chineseIntakeByUnit = new Map(chineseIntake.units.map(unit => [unit.publisherUnitId, unit]));
const lifeTargetBriefs = await Promise.all(Array.from({length: 6}, async (_, index) =>
  JSON.parse(await readFile(path.join(root, `data/content-intake/life-nani-115-t${String(index + 1).padStart(2, "0")}-brief.json`), "utf8"))
));
const renderSubjects = data.subjects.map(subject => subject.id === "life"
  ? {
      ...subject,
      publisherLabel: "版本分層",
      layerLabel: "南一115目標·T01 production·T02–T06 parity candidates",
      intro: "T01 已完成使用者 parity；T02–T06 依 115 官方 outline 與可匹配的 113–115 公開課程訊號建立原創教學候選頁，待一次性 human parity 確認。",
      units: lifeTargetBriefs.map(brief => brief.unit)
    }
  : subject);
const unitFolder = (subject, index) => subject.id === "chinese" ? `chinese/L${String(index + 1).padStart(2,"0")}` : subject.id === "math" ? `math/U${String(index + 1).padStart(2,"0")}` : `life/T${String(index + 1).padStart(2,"0")}`;
const subjectObjectives = {
  chinese: unit => [unit.focus,"朗讀已核對詞彙，辨識生字、認讀字與語詞","使用兩個詞語造完整句","聆聽同學並提出一個問題"],
  math: unit => [unit.focus,"用操作或圖像表徵問題","說明解題方法與檢查答案","把概念應用到生活情境"],
  life: unit => unit.objectives?.length ? unit.objectives : [unit.focus,"提出可觀察的問題","選擇合適的方法進行探究","記錄、比較並分享發現"]
};
const subjectFlows = {
  chinese: ["選擇詞彙 👀","朗讀與辨音 🔊","查看詞義 🔎","完成句子 ✍️","分享與回應 🤝"],
  math: ["讀懂問題 📖","操作或畫圖 🧩","列式解題 ✏️","檢查答案 ✅","說明方法 💬"],
  life: ["觀察現象 👀","提出問題 ❓","動手探究 🧪","記錄比較 📝","分享發現 🌟"]
};
const slideImages = Array.from({length:13},(_,i)=>`<img src="../../assets/notebooklm/slides/slide-${String(i+1).padStart(2,"0")}.jpg" alt="NotebookLM 全冊簡報第 ${i+1} 頁"${i===0?' class="active"':''}>`).join("");
const slideDots = Array.from({length:13},(_,i)=>`<button class="carousel-dot${i===0?' active':''}" aria-label="前往第 ${i+1} 頁"></button>`).join("");
const zhuyinHtml = value => {
  const symbols = [...String(value)];
  const tones = new Set(["ˊ","ˇ","ˋ","˙"]);
  const tone = tones.has(symbols.at(-1)) ? symbols.pop() : "";
  return symbols.map((symbol,index)=>index === symbols.length-1 && tone ? `<span class="zy-row">${esc(symbol)}<span class="zy-tone">${tone}</span></span>` : `<span>${esc(symbol)}</span>`).join("");
};
const chineseExtensionHtml = unit => {
  if (!unit.verticalSummary && !unit.vocabulary?.length && !unit.characters?.length) return "";
  const summary = unit.verticalSummary ? `<div class="section-title"><span>📖</span> 直式朗讀練習</div><section class="card"><p class="vert-summary">${esc(unit.verticalSummary)}</p></section>` : "";
  const vocabulary = unit.vocabulary?.length ? `<div class="section-title"><span>💬</span> 重點詞彙</div><section class="card"><div class="vocab-grid">${unit.vocabulary.map(item=>`<div class="vocab-item"><div class="vocab-word">${esc(item.word)}</div><div class="vocab-meaning">${esc(item.meaning)}</div></div>`).join("")}</div></section>` : "";
  const characters = unit.characters?.length ? `<div class="section-title"><span>✍️</span> 生字與注音</div><section class="card"><div class="char-grid">${unit.characters.map(item=>`<button class="char-box" type="button" data-char="${esc(item.char)}" data-zy="${esc(item.zhuyin)}"><span class="char-main">${esc(item.char)}</span><span class="zy-col">${zhuyinHtml(item.zhuyin)}</span></button>`).join("")}</div></section>` : "";
  return summary + vocabulary + characters;
};
const chineseSourceWordBankHtml = unit => {
  const intake = chineseIntakeByUnit.get(unit.id);
  if (!intake) return "";
  const group = (label, terms) => terms?.length ? `<details class="source-terms" open><summary>${esc(label)}（${terms.length}）</summary><div class="topic-flow">${terms.map(term => `<button class="topic-pill vocab-speak" type="button" data-word="${esc(term)}" aria-label="朗讀詞語：${esc(term)}">${esc(term)} <span aria-hidden="true">🔊</span></button>`).join("")}</div></details>` : "";
  const listening = intake.officialListening
    ? `<p class="source-link"><a href="${esc(intake.officialListening.playlistUrl)}" target="_blank" rel="noreferrer">前往翰林聽 e 聽：本課課文朗讀／領讀 →</a><br><small>${esc(intake.officialListening.accessBoundary)}</small></p>`
    : "";
  return `<div class="section-title"><span>📚</span> 已核對詞彙與朗讀入口</div><section class="card public-layer"><p><strong>已完成公開學習層：</strong>課名、教育雲逐課詞彙與翰林朗讀入口均已核對。以下按原始類別列出詞彙；點按可使用本機瀏覽器的中文發音練習。</p>${group("生字", intake.sourceTerms["生字"])}${group("認讀字", intake.sourceTerms["認讀字"])}${group("語詞", intake.sourceTerms["語詞"])}<p class="source-link"><a href="${esc(intake.sourceUrl)}" target="_blank" rel="noreferrer">在教育雲查看本課公開詞彙與釋義 →</a></p>${listening}<p class="content-boundary">課文事件、人物、段落與理解題尚未有合法 text-structure brief；本站不以詞彙或課名推測課文內容，也不會在這個狀態產製本課 NotebookLM／YouTube 影片。</p></section>`;
};
const chineseReadingGuideHtml = unit => {
  const g = unit.readingGuide;
  if (!g) return "";
  const audio = g.audioUrl ? `<div class="reading-audio"><a class="listen-btn" href="${esc(g.audioUrl)}" target="_blank" rel="noreferrer">▶ 播放官方課文朗讀</a>${g.audioLabel?`<p class="audio-label">${esc(g.audioLabel)}</p>`:""}${g.audioBoundary?`<p class="audio-boundary"><small>${esc(g.audioBoundary)}</small></p>`:""}</div>` : "";
  const tasks = g.listeningTasks?.length ? `<h3 class="reading-guide-h">邊聽邊做</h3><ol class="listen-tasks">${g.listeningTasks.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>` : "";
  const placeholder = g.textPlaceholderNote ? `<p class="text-placeholder">📄 ${esc(g.textPlaceholderNote)}</p>` : "";
  return `<div class="section-title"><span>📖</span> 課文朗讀與閱讀引導</div><section class="card reading-guide">${audio}${tasks}${placeholder}</section>`;
};
const chineseOriginalAdaptationHtml = unit => {
  const a = unit.originalAdaptation;
  if (!a) return "";
  const paras = a.paragraphs.map(p => `<p class="adaptation-para">${esc(p)}<button class="vocab-speak adaptation-speak" type="button" data-word="${esc(p)}" aria-label="朗讀這一段">🔊</button></p>`).join("");
  const comprehension = a.comprehension.map(q => `<div class="quiz-item"><div class="quiz-q">❓ ${esc(q.q)}</div><div class="quiz-opts">${q.options.map(o=>`<button class="quiz-opt" data-correct="${o.correct?"1":"0"}">${esc(o.text)}</button>`).join("")}</div></div>`).join("");
  return `<div class="section-title"><span>📗</span> ${esc(a.title)}</div><section class="card adaptation-card"><p class="adaptation-attribution">${esc(a.attributionNote)}</p>${paras}</section><div class="section-title"><span>🧠</span> 閱讀理解（依原創改編故事）</div>${comprehension}`;
};
const lessonMediaHtml = unit => {
  const video = unit.artifact?.video;
  if (video?.youtubeId) return `<div class="section-title"><span>🎬</span> 本課學生自學影片</div><section class="card"><p>${esc(video.title || "NotebookLM 本課學生自學影片")}</p><div class="video"><iframe src="https://www.youtube.com/embed/${esc(video.youtubeId)}" title="${esc(video.title || "本課學生自學影片")}" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div></section>`;
  return `<div class="section-title"><span>🎬</span> 本課媒體狀態</div><section class="card"><p><strong>本課專屬 NotebookLM 簡報／影片尚未產製。</strong>必須先完成來源包、內容核對與 artifact QA，才會嵌入本課影片。</p><p>目前可用的是 <a href="https://youtu.be/oD0GIU4UKPc" target="_blank" rel="noreferrer">全冊學習導覽</a>，它不是本課專屬影片。</p></section>`;
};
const sourceLayerHtml = unit => {
  const layer = unit.sourceLayer;
  if (!layer) return "";
  return `<div class="section-title"><span>🧭</span> 資料狀態與使用邊界</div><section class="card source-layer-card"><p><strong>${esc(layer.status)}</strong></p><p><strong>Evidence：</strong>${esc(layer.evidence)}</p><p><strong>Boundary：</strong>${esc(layer.boundary)}</p></section>`;
};
const mathExtensionHtml = unit => {
  const math = unit.mathExtension;
  if (!math) return "";
  const manipulative = math.manipulative
    ? `<div class="base-ten-builder" data-min="${Number(math.manipulative.min)}" data-max="${Number(math.manipulative.max)}" data-default="${Number(math.manipulative.default)}"><h3>${esc(math.manipulative.label)}</h3><p>${esc(math.manipulative.prompt)}</p><div class="base-ten-controls"><label>要拆解的數 <input class="base-ten-input" type="number" inputmode="numeric" min="${Number(math.manipulative.min)}" max="${Number(math.manipulative.max)}" value="${Number(math.manipulative.default)}"></label><button class="base-ten-run" type="button">拆解位值</button></div><p class="base-ten-output" aria-live="polite"></p><div class="base-ten-visual" aria-hidden="true"></div></div>`
    : "";
  const representations = math.representations?.length
    ? `<div class="math-card-grid">${math.representations.map(item => `<article class="math-card"><h3>${esc(item.label)}</h3><div class="math-parts">${(item.parts || []).map(part => `<span class="math-part">${esc(part)}</span>`).join("")}</div><p>${esc(item.sentence)}</p></article>`).join("")}</div>`
    : "";
  const workedExamples = math.workedExamples?.length
    ? math.workedExamples.map(example => `<article class="worked-example"><h3>${esc(example.title)}</h3><ol>${(example.steps || []).map(step => `<li>${esc(step)}</li>`).join("")}</ol>${example.check ? `<p class="math-check"><strong>檢查：</strong>${esc(example.check)}</p>` : ""}</article>`).join("")
    : "";
  const reasoning = math.reasoningSteps?.length
    ? `<section class="card"><h2>推理流程</h2><ol class="reasoning-list">${math.reasoningSteps.map(step => `<li>${esc(step)}</li>`).join("")}</ol></section>`
    : "";
  const misconceptions = math.misconceptions?.length
    ? `<section class="card misconception-card"><h2>常見錯誤警訊</h2><ul>${math.misconceptions.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>`
    : "";
  const formative = math.formativeChecks?.length
    ? `<div class="section-title"><span>🧪</span> 單元小檢核</div>${math.formativeChecks.map(q => `<div class="quiz-item"><div class="quiz-q">❓ ${esc(q.q)}</div><div class="quiz-opts">${q.options.map(option => `<button class="quiz-opt" data-correct="${option.correct ? "1" : "0"}">${esc(option.text)}</button>`).join("")}</div></div>`).join("")}`
    : "";
  return `<div class="section-title"><span>🧮</span> ${esc(math.representationTitle || "數學操作與表徵")}</div><section class="card math-lab"><p><strong>${esc(math.status || "teacher-ready slice")}</strong></p>${manipulative}${representations}</section>${workedExamples ? `<div class="section-title"><span>✏️</span> Worked Examples</div><section class="card worked-grid">${workedExamples}</section>` : ""}<div class="grid math-grid">${reasoning}${misconceptions}</div>${formative}`;
};
const lifeExtensionHtml = unit => {
  const life = unit.lifeExtension;
  if (!life) return "";
  const observation = life.observationPrompts?.length
    ? `<div class="observation-record">${life.observationPrompts.map(item => `<label><strong>${esc(item.label)}</strong><span>${esc(item.prompt)}</span><textarea rows="3" placeholder="請輸入或畫下你的紀錄" aria-label="${esc(item.label)}"></textarea></label>`).join("")}</div>`
    : "";
  const inquiry = life.inquiryFlow?.length
    ? `<section class="card life-inquiry"><h2>🔎 ${esc(life.inquiryTitle || "探究流程")}</h2><ol>${life.inquiryFlow.map(step => `<li>${esc(step)}</li>`).join("")}</ol></section>`
    : "";
  const safety = life.safetyNotes?.length
    ? `<section class="card life-safety"><h2>🛡️ ${esc(life.safetyTitle || "安全觀察規則")}</h2><ul>${life.safetyNotes.map(note => `<li>${esc(note)}</li>`).join("")}</ul></section>`
    : "";
  const reflection = life.reflectionPrompt
    ? `<section class="card life-reflection"><h2>🪞 ${esc(life.reflectionTitle || "證據反思")}</h2><p>${esc(life.reflectionPrompt)}</p><textarea rows="4" placeholder="用圖、符號或一句完整的話留下發現" aria-label="證據反思紀錄"></textarea></section>`
    : "";
  const teacherChecklist = life.teacherChecklist?.length
    ? `<section class="card teacher teacher-only life-teacher-check"><h2>👩‍🏫 教師 evidence checklist</h2>${life.teacherChecklist.map(item => `<label><input type="checkbox"> ${esc(item)}</label>`).join("")}</section>`
    : "";
  const formative = life.formativeChecks?.length
    ? `<div class="section-title"><span>🧪</span> ${esc(life.checkTitle || "生活探究小檢核")}</div>${life.formativeChecks.map(q => `<div class="quiz-item"><div class="quiz-q">❓ ${esc(q.q)}</div><div class="quiz-opts">${q.options.map(option => `<button class="quiz-opt" data-correct="${option.correct ? "1" : "0"}">${esc(option.text)}</button>`).join("")}</div></div>`).join("")}`
    : "";
  return `<div class="section-title"><span>📋</span> ${esc(life.recordTitle || "標誌偵探觀察紀錄")}</div><section class="card life-observation"><p><strong>${esc(life.recordInstruction || "先記錄 observation，再寫 inference，最後用 evidence 核對。")}</strong></p>${observation}</section><div class="grid life-grid">${inquiry}${safety}${reflection}${teacherChecklist}</div>${formative}`;
};
const legacyOverviewVideoPattern = /<div class="section-title"><span>🎬<\/span> 學生自學影片<\/div><section class="card"><p>NotebookLM 生成｜小二上國語、數學、生活全冊學習導覽（5:58）<\/p><div class="video"><iframe[^>]*><\/iframe><\/div><\/section>/;
const legacyNotebookDeckPattern = /<div class="section-title"><span>📽️<\/span> NotebookLM 全冊教學簡報<\/div><section class="carousel" id="main-carousel">[\s\S]*?<\/section>/;

for (const subject of renderSubjects) {
  const overviewDepth = subject.path.includes("/") ? "../" : "";
  const unitLabel = subject.id === "chinese" ? "課" : subject.id === "life" ? "主題" : "單元";
  const publisherLabel = subject.publisherLabel || "翰林版";
  const layerLabel = subject.layerLabel || "114學年度目錄";
  const cards = subject.units.map((unit, index) => {
    const href = subject.id === "chinese" ? `chinese/L${String(index + 1).padStart(2,"0")}/index.html` : `${unitFolder(subject,index).split("/").slice(-1)[0]}/index.html`;
    const cardLayer = unit.layerLabel || layerLabel;
    return `<article class="unit"><div class="num">第 ${index + 1} ${unitLabel}</div><div class="unit-layer">${esc(cardLayer)}</div><h3>${esc(unit.title)}</h3><p>${esc(unit.focus)}</p><a class="open" href="${href}">進入教學駕駛艙 →</a></article>`;
  }).join("");
  const subjectSources = subject.id === "life"
    ? [
        {label: "南一 115 低年級教材簡介（生活主題 outline）", url: "https://naniexpo.nani.com.tw/uploads/pdf/20260312_201419_4ea29e252cdd.pdf"},
        {label: "東園國小 114 二上南一生活課程計畫（跨年同名主題信號）", url: "https://tten.tp.edu.tw/Login/Downment?grade=2&spid=34e77ca2-f290-4b10-8700-89ec75155e60&subject=LifeCourse"}
      ]
    : data.sources;
  const sources = subjectSources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)}</a></li>`).join("");
  const overview = `<!doctype html><html lang="zh-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject.label)}教學駕駛艙｜${esc(publisherLabel)}小二上</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap" rel="stylesheet"><link rel="stylesheet" href="${overviewDepth}assets/css/subject.css"><style>:root{--accent:${subject.accent}}</style></head><body><a class="skip" href="#content">跳到主要內容</a><header><div class="head"><a href="${overviewDepth}index.html">← 返回首頁</a><h1>${subject.emoji} ${esc(subject.label)}教學駕駛艙</h1><div class="meta"><span class="badge">${esc(publisherLabel)}</span><span class="badge">二年級上學期</span><span class="badge">${esc(layerLabel)}</span><span class="badge">原創教學活動</span></div></div></header><main id="content"><p class="intro">${esc(subject.intro)}</p><div class="tools"><button id="font-up">A+ 放大</button><button id="font-down">A- 縮小</button></div><h2>課程地圖</h2><div class="grid">${cards}</div><aside class="sources"><strong>資料來源與使用邊界</strong><p>課名與單元依公開課程資料核對；本站不重製課文、習題或教師手冊。教學活動為本站原創，請搭配合法教材。</p><ul>${sources}</ul></aside></main><footer>edu2 · ${esc(publisherLabel)}小二上 ${esc(subject.label)}</footer><script src="${overviewDepth}assets/js/subject.js" defer></script></body></html>`;
  const overviewTarget = path.join(root, subject.path);
  await mkdir(path.dirname(overviewTarget), {recursive:true});
  await writeFile(overviewTarget, overview + "\n");

  for (const [index, unit] of subject.units.entries()) {
    const folder = path.join(root, unitFolder(subject,index));
    await mkdir(folder,{recursive:true});
    const back = subject.id === "chinese" ? "../../chinese.html" : "../index.html";
    const misconception = subject.id === "chinese" ? "只認字就等於完成；還要朗讀、查看詞義，並用完整句表達。" : subject.id === "math" ? "只追求算得快；其實要能用圖像、操作或生活語言說明方法。" : "只是在玩遊戲；其實每次實作都要觀察、記錄、比較並分享發現。";
    const objectives = subjectObjectives[subject.id](unit).map((text,i)=>`<div class="obj-chip"><span class="num">${i+1}</span>${esc(text)}</div>`).join("");
    const unitFlow = unit.flow?.length ? unit.flow : subjectFlows[subject.id];
    const flow = unitFlow.map((text,i,all)=>`<span class="topic-pill">${esc(text)}</span>${i<all.length-1?'<span class="topic-arrow">→</span>':''}`).join("");
    const chineseExtension = subject.id === "chinese" ? chineseExtensionHtml(unit) : "";
    const chineseSourceWordBank = subject.id === "chinese" ? chineseSourceWordBankHtml(unit) : "";
    const chineseReadingGuide = subject.id === "chinese" ? chineseReadingGuideHtml(unit) : "";
    const chineseOriginalAdaptation = subject.id === "chinese" ? chineseOriginalAdaptationHtml(unit) : "";
    const sourceLayer = sourceLayerHtml(unit);
    const mathExtension = subject.id === "math" ? mathExtensionHtml(unit) : "";
    const lifeExtension = subject.id === "life" ? lifeExtensionHtml(unit) : "";
    const unitPublisherLabel = unit.publisherLabel || publisherLabel;
    const unitLayerLabel = unit.layerLabel || layerLabel;
    const teacherUnderstandingQuestion = subject.id === "chinese" ? "你能選兩個已核對詞語，說出自己的完整句嗎？" : `你能用自己的話說明${esc(unit.title)}的重點嗎？`;
    const firstQuizQuestion = subject.id === "chinese" ? "這個公開詞彙練習最重要的學習焦點是什麼？" : `${esc(unit.title)}這一課／單元最重要的學習焦點是什麼？`;
    const sourceNote = subject.id === "chinese" ? "本頁依公開課程目錄與詞彙表設計，不重製課文或題本；請搭配合法教材使用。" : "本頁依公開課程目錄與學習目標設計，不重製課文或題本；請搭配合法教材使用。";
    const page = `<!doctype html><html lang="zh-TW"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(unit.title)}｜${esc(publisherLabel)}小二上${esc(subject.label)}</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap" rel="stylesheet"><link rel="stylesheet" href="../../assets/css/unit.css"><style>:root{--accent:${subject.accent}}</style></head><body><a class="skip" href="#content">跳到主要內容</a><canvas id="draw-canvas"></canvas><div class="fullscreen" id="fullscreen"><img id="fullscreen-img" alt="放大的簡報頁"></div><header><div class="head"><a class="back" href="${back}">← 返回${esc(subject.label)}課程地圖</a><h1>${subject.emoji} 第 ${index+1} ${unitLabel}｜${esc(unit.title)}</h1><div class="badges"><span class="badge">${esc(publisherLabel)}</span><span class="badge">二年級上學期</span><span class="badge">${esc(layerLabel)}</span><span class="badge">原創教學設計</span></div></div></header><div class="mode-bar"><span id="mode-label">🧑‍🎓 學生模式</span><button class="mode-btn" id="mode-btn">✏️ 切換教師模式</button></div><aside class="tool-panel" aria-label="課堂工具"><div class="tool-content" id="tool-content"><div><div class="tool-lbl">字級</div><div class="font-ctrl"><button class="font-btn" id="font-dec">A−</button><span class="font-val" id="font-val">16px</span><button class="font-btn" id="font-inc">A＋</button></div></div><div><div class="tool-lbl">計時器</div><div class="timer-disp" id="timer-disp">05:00</div><div class="timer-presets"><button class="timer-preset" data-sec="60">1分</button><button class="timer-preset" data-sec="180">3分</button><button class="timer-preset" data-sec="300">5分</button><button class="timer-preset" data-sec="600">10分</button></div><div class="timer-btns"><button class="timer-btn" id="timer-start">▶ 開始</button><button class="timer-btn" id="timer-reset">↺ 重置</button></div></div><div><div class="tool-lbl">畫筆</div><button class="draw-btn" id="draw-toggle">🖌️ 開啟畫筆</button><div class="draw-colors"><button class="draw-color active" data-color="#ffd54f" style="background:#ffd54f" aria-label="黃色"></button><button class="draw-color" data-color="#ff8a80" style="background:#ff8a80" aria-label="紅色"></button><button class="draw-color" data-color="#81d4fa" style="background:#81d4fa" aria-label="藍色"></button><button class="draw-color" data-color="#a5d6a7" style="background:#a5d6a7" aria-label="綠色"></button></div><div class="draw-sizes"><button class="draw-size" data-size="3" style="width:9px;height:9px" aria-label="細筆"></button><button class="draw-size active" data-size="7" style="width:15px;height:15px" aria-label="中筆"></button><button class="draw-size" data-size="14" style="width:23px;height:23px" aria-label="粗筆"></button></div><button class="draw-btn" id="draw-clear">🗑️ 清除畫布</button></div></div><button class="tool-toggle" id="tool-toggle">工具</button></aside><main id="content"><section class="card hero"><h2>本課學習焦點</h2><p>${esc(unit.focus)}</p><button class="speak" id="speak-title">🔊 朗讀標題</button></section><div class="section-title"><span>🎯</span> 學習目標</div><section class="card"><div class="obj-grid">${objectives}</div></section><div class="section-title"><span>🗺️</span> 學習脈絡</div><section class="card"><div class="topic-flow">${flow}</div></section><div class="section-title"><span>📽️</span> NotebookLM 全冊教學簡報</div><section class="carousel" id="main-carousel"><div class="carousel-inner">${slideImages}</div><button class="carousel-btn prev" aria-label="上一頁">‹</button><button class="carousel-btn next" aria-label="下一頁">›</button><div class="carousel-dots">${slideDots}</div></section>${chineseExtension}<div class="section-title"><span>🧩</span> 課堂實作</div><div class="grid"><section class="panel"><h2>🎯 課堂任務</h2><p class="mission">${esc(unit.mission)}</p><h3>任務流程</h3><div class="steps"><div class="step"><strong>觀察</strong>：先說出你看見、聽見或已知道的線索。</div><div class="step"><strong>思考</strong>：和同學比較不同方法或想法。</div><div class="step"><strong>表達</strong>：完成任務並用一句完整的話分享發現。</div></div></section><section class="panel teacher teacher-only"><h2>👩‍🏫 教師提示</h2><h3>Bloom 三層提問</h3><ol><li><strong>記憶：</strong>這一課／單元有哪些重要詞語或概念？</li><li><strong>理解：</strong>${teacherUnderstandingQuestion}</li><li><strong>應用：</strong>你能在生活中找到相似例子，或完成今天的課堂任務嗎？</li></ol><h3>常見迷思</h3><p>${esc(misconception)}</p></section><section class="panel checks"><h2>✅ 自我檢核</h2><label><input type="checkbox"> 我能說出今天的學習重點。</label><label><input type="checkbox"> 我能完成課堂任務。</label><label><input type="checkbox"> 我能聽懂同學的方法並回應。</label><label><input type="checkbox"> 我能說出下一次想改進的地方。</label></section><section class="panel"><h2>💬 離堂小卡</h2><p>請完成一句話：</p><p class="mission">今天我學會＿＿＿＿；我還想知道＿＿＿＿。</p></section></div><div class="section-title"><span>📝</span> 形成性評量</div><div class="quiz-item"><div class="quiz-q">❓ ${firstQuizQuestion}</div><div class="quiz-opts"><button class="quiz-opt" data-correct="1">${esc(unit.focus)}</button><button class="quiz-opt" data-correct="0">只要把答案背起來</button><button class="quiz-opt" data-correct="0">只要完成速度最快</button><button class="quiz-opt" data-correct="0">不用說明思考方法</button></div></div><div class="quiz-item"><div class="quiz-q">❓ 完成任務後，哪一個做法最能幫助學習？</div><div class="quiz-opts"><button class="quiz-opt" data-correct="0">不聽別人的方法</button><button class="quiz-opt" data-correct="1">分享發現並回應同學</button><button class="quiz-opt" data-correct="0">只看答案不檢查</button><button class="quiz-opt" data-correct="0">跳過觀察與記錄</button></div></div><div class="section-title"><span>🎬</span> 學生自學影片</div><section class="card"><p>NotebookLM 生成｜小二上國語、數學、生活全冊學習導覽（5:58）</p><div class="video"><iframe src="https://www.youtube.com/embed/oD0GIU4UKPc" title="小二上全冊學生自學影片" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div></section><p class="source-note">${sourceNote}</p></main><footer>edu2 Complete Teaching Cockpit · ${esc(subject.label)}第 ${index+1} ${unitLabel}</footer><script src="../../assets/js/unit.js" defer></script></body></html>`;
    const practicalMarker = `<div class="section-title"><span>🧩</span> 課堂實作</div>`;
    const pageWithArtifactBoundary = subject.id === "life"
      ? page.replace(legacyNotebookDeckPattern, `<div class="section-title"><span>📽️</span> 本主題 NotebookLM 簡報</div><section class="card"><p><strong>第二階段待產製。</strong>完成本批 human parity 與 artifact QA 後，才會加入本主題專屬簡報；目前不混用 114 全冊簡報。</p></section>`)
      : page;
    const pageWithUnitLabels = pageWithArtifactBoundary
      .replace(`href="../../assets/css/unit.css"`, `href="../../assets/css/unit.css?v=${assetVersion}"`)
      .replace(`src="../../assets/js/unit.js"`, `src="../../assets/js/unit.js?v=${assetVersion}"`)
      .replace(`<title>${esc(unit.title)}｜${esc(publisherLabel)}小二上${esc(subject.label)}</title>`, `<title>${esc(unit.title)}｜${esc(unitPublisherLabel)}小二上${esc(subject.label)}</title>`)
      .replace(`<span class="badge">${esc(publisherLabel)}</span><span class="badge">二年級上學期</span><span class="badge">${esc(layerLabel)}</span>`, `<span class="badge">${esc(unitPublisherLabel)}</span><span class="badge">二年級上學期</span><span class="badge">${esc(unitLayerLabel)}</span>`);
    const pageWithSourceLayer = sourceLayer
      ? pageWithUnitLabels.replace(`</section><div class="section-title"><span>🎯</span> 學習目標</div>`, `</section>${sourceLayer}<div class="section-title"><span>🎯</span> 學習目標</div>`)
      : pageWithUnitLabels;
    const pageWithChineseSource = subject.id === "chinese"
      ? pageWithSourceLayer.replace(`${chineseExtension}${practicalMarker}`, `${chineseExtension}${chineseSourceWordBank}${chineseReadingGuide}${chineseOriginalAdaptation}${practicalMarker}`)
      : pageWithSourceLayer.replace(practicalMarker, `${mathExtension}${lifeExtension}${practicalMarker}`);
    const renderedPage = pageWithChineseSource.replace(legacyOverviewVideoPattern, lessonMediaHtml(unit));
    if (renderedPage === page) throw new Error(`無法替換第 ${index + 1} ${unitLabel} 的共用全冊影片`);
    await writeFile(path.join(folder,"index.html"),renderedPage+"\n");
  }
  console.log(`built ${subject.path} + ${subject.units.length} unit pages`);
}
