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
  if (catalog.project?.academicYear !== 115) errors.push("edu2 必須使用 115 學年度版本基準");
  if (catalog.project?.defaultPublisher !== "school-baseline-115") errors.push("edu2 defaultPublisher 必須是 115 學年校訂組合");
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
  const expectedPublishers = {chinese: "hanlin", math: "kanghsuan", life: "nani"};
  for (const [subjectId, publisher] of Object.entries(expectedPublishers)) {
    const subject = catalog.subjects?.find(item => item.id === subjectId);
    if (subject?.publisher !== publisher) errors.push(`${subjectId}: 115 出版社應為 ${publisher}`);
    const allowedStatus = subjectId === "math" ? "awaiting-catalog" : "outline-verified-content-pending";
    if (subject?.status !== allowedStatus || subject?.href !== null) errors.push(`${subjectId}: 115 資料狀態或停用 href 不符合 source gate`);
  }
}

try {
  const baseline = JSON.parse(await read("data/source-registry/academic-year-115-version-baseline.json"));
  const expected = {chinese: "hanlin", math: "kanghsuan", life: "nani"};
  if (baseline.academicYear !== 115) errors.push("115 version baseline 學年錯誤");
  for (const [subject, publisher] of Object.entries(expected)) {
    if (baseline.subjectPublisherMap?.[subject] !== publisher) errors.push(`115 version baseline 缺少 ${subject}→${publisher}`);
  }
} catch (error) { errors.push(`115 version baseline 無法解析：${error.message}`); }

try {
  const manifest115 = JSON.parse(await read("data/academic-year-115.json"));
  const expected = {chinese: "hanlin", math: "kanghsuan", life: "nani"};
  if (manifest115.academicYear !== 115 || manifest115.status !== "partial-official-outlines-verified-content-pending") errors.push("115 content manifest 狀態錯誤");
  for (const [subjectId, publisher] of Object.entries(expected)) {
    const subject = manifest115.subjects?.find(item => item.id === subjectId);
    if (subject?.publisher !== publisher) errors.push(`115 content manifest 缺少 ${subjectId}→${publisher}`);
    if (subjectId === "math" && (subject?.status !== "awaiting-official-outline" || (subject?.units || []).length !== 0)) errors.push("math: 115 正式 outline 未核對前必須保持空單元 manifest");
  }
  const chinese = manifest115.subjects?.find(item => item.id === "chinese");
  if (chinese?.status !== "official-outline-verified-eleven-fallback-human-confirmed-l07-blocked" || chinese?.contentIntake !== "data/content-intake/chinese-hanlin-115.json" || chinese?.units?.length !== 12) errors.push("chinese: 115 翰林長批次 promotion 狀態錯誤");
  if (chinese?.units?.[0]?.unitBrief !== "data/content-intake/chinese-hanlin-115-l01-brief.json" || chinese?.units?.[0]?.status !== "fallback-publication-ready-human-confirmed") errors.push("chinese: L01 formal fallback brief promotion 關聯錯誤");
  try {
    const chineseIntake = JSON.parse(await read("data/content-intake/chinese-hanlin-115.json"));
    if (chineseIntake.publisher !== "hanlin" || chineseIntake.academicYear !== 115 || chineseIntake.units?.length !== 12 || chineseIntake.themes?.length !== 4 || chineseIntake.readingItems?.length !== 2) errors.push("國語 115 intake 版本、課次、主題或來閱讀數錯誤");
    if (!chineseIntake.units?.every(unit => unit.titleStatus === "verified-publisher-outline")) errors.push("國語 115 intake 含未核對的課名");
    if (chineseIntake.units?.some(unit => !["詩歌", "記敘文", "應用文（日記）"].includes(unit.genre))) errors.push("國語 115 intake 含非官方表列文體");
    if (chineseIntake.units?.find(unit => unit.publisherUnitId === "L01")?.title !== "我的心情") errors.push("國語 115 L01 必須是二上〈我的心情〉，不得誤用一下〈春天來了〉");
    if (chineseIntake.units?.[0]?.unitBrief !== "data/content-intake/chinese-hanlin-115-l01-brief.json" || chineseIntake.units?.[0]?.contentStatus !== "fallback-publication-ready-human-confirmed") errors.push("國語 115 intake 缺少 L01 human-confirmed promotion 關聯");
    const chineseBatchSequences = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    for (const sequence of chineseBatchSequences) {
      const unit = chineseIntake.units?.[sequence - 1];
      const briefPath = `data/content-intake/chinese-hanlin-115-l${String(sequence).padStart(2, "0")}-brief.json`;
      if (unit?.unitBrief !== briefPath || unit?.contentStatus !== "fallback-publication-ready-human-confirmed") errors.push(`國語 L${String(sequence).padStart(2, "0")} intake 缺少 human-confirmed promotion 關聯`);
    }
    const blockedL07 = chineseIntake.units?.[6];
    if (blockedL07?.contentStatus !== "blocked-cross-year-title-mismatch" || blockedL07?.unitBrief || !blockedL07?.blockedReason?.includes("不一樣的美食")) errors.push("國語 L07 必須維持 cross-year title mismatch blocked");
    if (!chineseIntake.readingItems?.every(item => item.titleStatus === "verified-publisher-outline" && ["詩歌", "記敘文"].includes(item.genre))) errors.push("國語 115 intake 含未核對的來閱讀 metadata");
  } catch (error) { errors.push(`國語 115 intake 無法解析：${error.message}`); }
  const life = manifest115.subjects?.find(item => item.id === "life");
  if (life?.status !== "official-outline-verified-all-units-publication-ready" || life?.contentIntake !== "data/content-intake/life-nani-115.json" || life?.units?.length !== 6) errors.push("life: 115 南一全科 publication-ready 狀態錯誤");
  try {
    const lifeIntake = JSON.parse(await read("data/content-intake/life-nani-115.json"));
    if (lifeIntake.publisher !== "nani" || lifeIntake.academicYear !== 115 || lifeIntake.units?.length !== 6) errors.push("生活 115 intake 版本或主題數錯誤");
    if (!lifeIntake.units?.every(unit => unit.titleStatus === "verified-publisher-outline")) errors.push("生活 115 intake 含未核對的主題");
    if (!lifeIntake.units?.every((unit, index) => unit.unitBrief === `data/content-intake/life-nani-115-t${String(index + 1).padStart(2, "0")}-brief.json`)) errors.push("生活 intake 缺少 T01–T06 unit brief 關聯");
    if (lifeIntake.units?.[0]?.contentStatus !== "publication-ready-human-confirmed") errors.push("生活 T01 必須保留 human-confirmed production 狀態");
    if (!lifeIntake.units?.every(unit => unit.contentStatus === "publication-ready-human-confirmed")) errors.push("生活 T01–T06 必須全數為 publication-ready-human-confirmed");
  } catch (error) { errors.push(`生活 115 intake 無法解析：${error.message}`); }
  const lifeTitles = ["標誌與生活", "吸住了", "我愛泡泡", "大樹", "和風做朋友", "冬天"];
  for (const [index, title] of lifeTitles.entries()) {
    const id = `T${String(index + 1).padStart(2, "0")}`;
    try {
      const lifeBrief = JSON.parse(await read(`data/content-intake/life-nani-115-t${String(index + 1).padStart(2, "0")}-brief.json`));
      if (lifeBrief.targetAcademicYear !== 115 || lifeBrief.grade !== 2 || lifeBrief.semester !== 1) errors.push(`生活 ${id} brief 年級／學期／目標學年錯誤`);
      if (lifeBrief.unit?.title !== title || lifeBrief.unit?.publisherUnitId !== id || lifeBrief.unit?.publisherLabel !== "南一115目標") errors.push(`生活 ${id} brief 主題或出版社標示錯誤`);
      if (!lifeBrief.sourceRefs?.includes("nani-115-low-primary-promo")) errors.push(`生活 ${id} brief 缺少 115 官方 outline source`);
      const ext = lifeBrief.unit?.lifeExtension;
      if (ext?.observationPrompts?.length < 3 || ext?.inquiryFlow?.length < 4 || ext?.safetyNotes?.length < 3 || !ext?.reflectionPrompt || ext?.teacherChecklist?.length < 3 || ext?.formativeChecks?.length < 2) errors.push(`生活 ${id} 缺少 observation/inquiry/safety/reflection/assessment contract`);
      if (!ext?.formativeChecks?.every(check => check.options?.length >= 4 && check.options.filter(option => option.correct).length === 1)) errors.push(`生活 ${id} formative checks 選項契約錯誤`);
    } catch (error) { errors.push(`生活 ${id} unit brief 無法解析：${error.message}`); }
  }
} catch (error) { errors.push(`115 content manifest 無法解析：${error.message}`); }

try {
  const collection = JSON.parse(await read("data/source-registry/academic-year-115-collection.json"));
  const expected = {chinese: "hanlin", math: "kanghsuan", life: "nani"};
  for (const [subject, publisher] of Object.entries(expected)) {
    if (collection.subjectBaselines?.[subject] !== publisher) errors.push(`115 collection registry 缺少 ${subject}→${publisher}`);
  }
  for (const id of ["hanlin-115-low-primary-promo", "tlsps-grade2-curriculum-plan-candidate", "ptc-114-hanlin-grade2-chinese-plan", "education-cloud-115-textword", "kanghsuan-primary-curriculum-plan", "kanghsuan-primary-math-digitalmaster", "kanghsuan-115-low-primary-promo", "cyc-115-public-curriculum-platform", "nani-primary-source-discovery", "nani-115-low-primary-promo", "dongyuan-114-nani-grade2-life-plan"]) {
    if (!collection.sources?.some(source => source.id === id)) errors.push(`115 collection registry 缺少 ${id}`);
  }
} catch (error) { errors.push(`115 source collection registry 無法解析：${error.message}`); }

try {
  const rawdata = JSON.parse(await read("data/rawdata-index.json"));
  if (rawdata.root !== "source/RAWdata") errors.push("RAWdata index root 必須是 source/RAWdata");
  for (const id of ["chinese-hanlin-115-official-outline", "chinese-hanlin-115-education-cloud-candidates", "chinese-hanlin-115-cross-year-candidates", "chinese-hanlin-115-rejected", "chinese-hanlin-114-historical-wordbank", "math-kanghsuan-115-official-candidates", "life-nani-115-official-outline"]) {
    if (!rawdata.collections?.some(collection => collection.id === id)) errors.push(`RAWdata index 缺少 ${id}`);
  }
} catch (error) { errors.push(`RAWdata index 無法解析：${error.message}`); }

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
  const mathSubject = hanlin.subjects?.find(item => item.id === "math");
  const lifeSubject = hanlin.subjects?.find(item => item.id === "life");
  if (!mathSubject?.publisherLabel?.includes("114歷史參考") || mathSubject.publisherLabel.includes("康軒115")) errors.push("114 歷史數學頁不得標示為康軒 115 內容");
  if (!lifeSubject?.publisherLabel?.includes("114歷史參考") || lifeSubject.publisherLabel.includes("南一115")) errors.push("114 歷史生活頁不得標示為南一 115 內容");
  if (!mathSubject?.units?.[0]?.mathExtension?.manipulative) errors.push("數學 U01 Golden candidate 缺少可操作位值表徵");
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
const sourceGates = await read("docs/content-source-gates.md");
const sourceAcquisition = await read("docs/source-acquisition.md");
const mathGoldenPage = await read("math/U01/index.html");
const lifeGoldenPage = await read("life/T01/index.html");
const lifeOverviewPage = await read("life/index.html");
const legacyPatterns = [/三年級/,/三下/,/href=["'](?:chinese\.html|math\/|science\/|L\d)/];
for (const pattern of legacyPatterns) {
  if (pattern.test(homepage)) errors.push(`首頁仍含舊教材內容：${pattern}`);
}
if (!homepage.includes("publisher-select")) errors.push("首頁缺少 publisher selector");
if (!homepage.includes("compare-view")) errors.push("首頁缺少 comparison view");
if (!foundationPage.includes("Milestone A")) errors.push("foundation.html 缺少 Milestone A 定義");
if (!foundationPage.includes("Milestone B")) errors.push("foundation.html 缺少 Milestone B 邊界");
if (!homepage.includes('href="workflow.html"')) errors.push("首頁缺少工作流程分頁入口");
if (!mathGoldenPage.includes("base-ten-builder") || !mathGoldenPage.includes("位值拆解器")) errors.push("數學 U01 頁缺少可操作位值表徵");
if (mathGoldenPage.includes("康軒115目標")) errors.push("數學 U01 歷史頁誤標為康軒 115 目標內容");
if (!lifeGoldenPage.includes("南一115目標") || !lifeGoldenPage.includes("標誌偵探觀察紀錄")) errors.push("生活 T01 缺少南一 115 目標或觀察紀錄 Golden");
if (lifeGoldenPage.includes("動物好朋友") || lifeGoldenPage.includes("翰林114歷史參考")) errors.push("生活 T01 仍混入舊歷史主題或標示");
if (!lifeOverviewPage.includes("南一 115 低年級教材簡介") || !lifeOverviewPage.includes("東園國小 114 二上南一生活課程計畫")) errors.push("生活總覽缺少正確的南一／東園來源入口");
for (const marker of ["observation-record", "life-inquiry", "life-safety", "life-reflection", "life-teacher-check"]) {
  if (!lifeGoldenPage.includes(marker)) errors.push(`生活 T01 頁缺少 ${marker}`);
}
const lifePageExpectations = [
  ["T02", "吸住了", "磁鐵測試紀錄"],
  ["T03", "我愛泡泡", "泡泡變因觀察紀錄"],
  ["T04", "大樹", "樹朋友身分卡"],
  ["T05", "和風做朋友", "風的證據地圖"],
  ["T06", "冬天", "冬日照顧紀錄"]
];
for (const [id, title, recordTitle] of lifePageExpectations) {
  const page = await read(`life/${id}/index.html`);
  for (const required of [title, "南一115目標", recordTitle, "observation-record", "life-inquiry", "life-safety", "life-reflection", "life-teacher-check"]) {
    if (!page.includes(required)) errors.push(`生活 ${id} 頁缺少 ${required}`);
  }
  if (page.includes("114歷史參考") || page.includes("動物好朋友")) errors.push(`生活 ${id} 仍混入歷史 reference 標示或內容`);
  if (page.includes("NotebookLM 全冊教學簡報") || !page.includes("第二階段待產製")) errors.push(`生活 ${id} artifact boundary 錯誤`);
}
if (lifeGoldenPage.includes("NotebookLM 全冊教學簡報") || !lifeGoldenPage.includes("第二階段待產製")) errors.push("生活 T01 artifact boundary 錯誤");
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
if (!workflowPage.includes("資料收集安全關卡")) errors.push("workflow.html 缺少資料收集安全關卡");
for (const gate of ["publisher-baseline-verified", "official-outline-verified", "unit-brief-verified", "fallback-brief-approved", "publication-ready", "artifact-ready"]) {
  if (!sourceGates.includes(gate)) errors.push(`Content Source Gates 缺少 ${gate}`);
}
if (!sourceGates.includes("內文年度核對")) errors.push("Content Source Gates 缺少內文年度核對");
if (!workflowPage.includes("檔名／URL 寫 115 不算")) errors.push("workflow.html 缺少內文年度 rejection 規則");
if (!workflowPage.includes('href="docs/content-source-gates.md"')) errors.push("workflow.html 缺少 Content Source Gates 入口");
if (!foundationPage.includes("資料收集安全關卡")) errors.push("foundation.html 缺少資料收集安全關卡入口");
if (!foundationPage.includes("data/rawdata-index.json")) errors.push("foundation.html 缺少 RAWdata index 入口");
if (!foundationPage.includes("docs/chinese-115-source-sweep-2026-07-12.md")) errors.push("foundation.html 缺少 115 國語 source sweep 入口");
if (!workflowPage.includes("docs/chinese-115-source-sweep-2026-07-12.md")) errors.push("workflow.html 缺少 115 國語 source sweep 入口");
if (!sourceAcquisition.includes("source/RAWdata/<subject>/<publisher>/<academicYear>/<purpose>/")) errors.push("source acquisition 缺少 RAWdata 分類規則");
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
  const serializedLog = JSON.stringify(log);
  if (serializedLog.includes("source/official/")) errors.push("source acquisition log 仍含舊 source/official 路徑");
  for (const id of ["SRC-20260711-001", "SRC-20260711-002", "SRC-20260711-003", "SRC-20260711-004", "SRC-20260711-005", "SRC-20260711-006", "SRC-20260711-007", "SRC-20260711-008", "SRC-20260711-009", "SRC-20260711-010", "SRC-20260711-011", "SRC-20260711-012", "SRC-20260712-001", "SRC-20260712-002", "SRC-20260712-003", "SRC-20260712-004", "SRC-20260712-005", "SRC-20260712-006", "SRC-20260712-007", "SRC-20260712-008", "SRC-20260712-009", "SRC-20260712-010", "SRC-20260712-011", "SRC-20260712-012", "SRC-20260810-001", "SRC-20260812-001"]) {
    if (!log.records?.some(record => record.id === id)) errors.push(`source acquisition log 缺少 ${id}`);
  }
} catch (error) { errors.push(`source registry 或 acquisition log 無法解析：${error.message}`); }

try {
  const candidate = JSON.parse(await read("data/content-intake/chinese-hanlin-115-l01-brief.candidate.json"));
  if (candidate.status !== "user-approved-114-fallback-candidate" || candidate.target?.title !== "我的心情") errors.push("L01 114 fallback candidate 狀態或課次錯誤");
  if (candidate.evidence?.sourceYear !== 114 || candidate.instructionalSignals?.textStructure !== null) errors.push("L01 cross-year candidate 不得冒充 115 課文結構");
  if (!candidate.evidence?.userFallbackDecision || !candidate.publicationRule?.includes("must not be labeled as official 115")) errors.push("L01 114 fallback candidate 缺少使用者決策或 official 115 禁止標示規則");
} catch (error) { errors.push(`L01 cross-year candidate 無法解析：${error.message}`); }

try {
  const brief = JSON.parse(await read("data/content-intake/chinese-hanlin-115-l01-brief.json"));
  if (brief.sourceStatus !== "fallback-brief-approved-cross-year-user-accepted") errors.push("L01 formal fallback brief gate 錯誤");
  if (brief.targetAcademicYear !== 115 || brief.sourceAcademicYear !== 114 || JSON.stringify(brief.acceptedAcademicYearRange) !== "[113,115]") errors.push("L01 formal fallback brief 學年邊界錯誤");
  if (!brief.sourceBoundary?.includes("不重製") || !brief.sourceBoundary?.includes("不標示為 115 官方")) errors.push("L01 formal fallback brief 缺少版權／官方標示邊界");
  if (brief.unit?.originalAdaptation?.paragraphs?.length !== 4 || brief.unit?.originalAdaptation?.comprehension?.length !== 3) errors.push("L01 原創閱讀或理解題未達 Golden contract");
  if (brief.unit?.characters?.some(item => !item.char || !item.zhuyin) || brief.unit?.characters?.length < 6) errors.push("L01 人工注音詞卡不足");
  if (!brief.unit?.languageWorkshop?.sentenceTemplate?.includes("{feeling}")) errors.push("L01 心情三段句活動缺少 template");
  if (brief.unit?.artifact?.notebooklm !== "pending-shared-stage-2" || brief.unit?.artifact?.youtube !== "pending-shared-stage-2") errors.push("L01 artifact 必須維持第二階段 pending");
  if (brief.unit?.sourceLayer?.status !== "fallback-publication-ready · human confirmed") errors.push("L01 formal fallback brief 尚未記錄 human-confirmed promotion");
} catch (error) { errors.push(`L01 formal fallback brief 無法解析：${error.message}`); }

const chineseBatchTitles = new Map([
  [2, "彩色的天空"], [3, "國王做新衣"], [4, "水草下的呱呱"], [5, "沙灘上的畫"], [6, "草叢裡的星星"],
  [8, "美食分享日"], [9, "好味道"], [10, "加加減減"], [11, "奇怪的門"], [12, "詠鵝"]
]);
for (const [sequence, title] of chineseBatchTitles) {
  const id = `L${String(sequence).padStart(2, "0")}`;
  try {
    const brief = JSON.parse(await read(`data/content-intake/chinese-hanlin-115-l${String(sequence).padStart(2, "0")}-brief.json`));
    if (brief.sourceStatus !== "fallback-brief-approved-cross-year-user-accepted" || brief.targetAcademicYear !== 115 || brief.sourceAcademicYear !== 114 || JSON.stringify(brief.acceptedAcademicYearRange) !== "[113,115]") errors.push(`${id}: fallback source gate 錯誤`);
    if (brief.unit?.publisherUnitId !== id || brief.unit?.title !== title) errors.push(`${id}: unit brief 課次或課名錯誤`);
    if (!brief.sourceRefs?.includes("hanlin-115-low-primary-promo") || !brief.sourceRefs?.includes("ptc-114-hanlin-grade2-chinese-plan") || !brief.sourceRefs?.includes("education-cloud-hanlin-114-wordbank")) errors.push(`${id}: source refs 不完整`);
    if (!brief.sourceBoundary?.includes("不重製") || !brief.sourceBoundary?.includes("不標示為 115 官方")) errors.push(`${id}: 版權或 official boundary 不完整`);
    const unit = brief.unit;
    if (unit?.originalAdaptation?.paragraphs?.length !== 4 || unit?.originalAdaptation?.comprehension?.length !== 3) errors.push(`${id}: 原創閱讀 contract 錯誤`);
    if (!unit?.originalAdaptation?.comprehension?.every(question => question.options?.length >= 2 && question.options.filter(option => option.correct).length === 1)) errors.push(`${id}: 理解題選項 contract 錯誤`);
    if (unit?.characters?.length !== 6 || unit.characters.some(item => !item.char || !item.zhuyin)) errors.push(`${id}: 人工注音卡 contract 錯誤`);
    if (unit?.languageWorkshop?.slots?.length < 3 || !unit.languageWorkshop.template) errors.push(`${id}: 動態句型 contract 錯誤`);
    if (unit?.artifact?.notebooklm !== "pending-shared-stage-2" || unit?.artifact?.youtube !== "pending-shared-stage-2") errors.push(`${id}: artifact 必須維持第二階段 pending`);
    if (unit?.sourceLayer?.status !== "fallback-publication-ready · human confirmed") errors.push(`${id}: human-confirmed promotion 標示錯誤`);
  } catch (error) { errors.push(`${id}: fallback brief 無法解析：${error.message}`); }
}

for (const template of ["data/templates/intake.template.json", "data/templates/publisher-mapping.template.json", "data/templates/unit-content.template.json"]) {
  try {
    JSON.parse(await read(template));
  } catch (error) {
    errors.push(`${template} 無法解析：${error.message}`);
  }
}

const unitCss = await read("assets/css/unit.css");
const chineseExample = await read("chinese/L01/index.html");
const chineseOverview = await read("chinese.html");
if (!unitCss.includes("writing-mode:vertical-rl")) errors.push("國語直式導讀缺少 vertical-rl");
if (!unitCss.includes("text-orientation:mixed")) errors.push("國語直式導讀缺少 mixed orientation");
if (/(?:^|[;{])\s*direction\s*:/.test(unitCss)) errors.push("國語直式樣式不得加入 direction");
if (!unitCss.includes("flex-direction:row-reverse")) errors.push("國語生字排列缺少 row-reverse");
if (chineseExample.includes("<ruby")) errors.push("國語注音不得使用 ruby");
if (!chineseExample.includes("zy-tone")) errors.push("國語注音範例缺少聲調定位");
if (!chineseExample.includes('<span class="zy-row">ㄣ<span class="zy-tone">ˇ</span>')) errors.push("國語注音聲調未放在末符號右側");
if (!chineseExample.includes("原創閱讀｜上臺分享") || !chineseExample.includes("心情三段句")) errors.push("L01 fallback Golden 缺少原創閱讀或語文活動");
if (!chineseExample.includes("不是翰林課文") || !chineseExample.includes("114 fallback／115 candidate")) errors.push("L01 fallback Golden 缺少來源邊界標示");
if ((chineseExample.match(/閱讀理解（只依 edu2 原創短文作答）/g) || []).length !== 1) errors.push("L01 原創閱讀理解區塊數量錯誤");
if ((chineseExample.match(/data-slot=/g) || []).length !== 3) errors.push("L01 心情三段句互動欄位不足");
if (!chineseExample.includes("本課教學提示") || !chineseExample.includes("假想情境回答")) errors.push("L01 教師提示未接入頁面");
if (chineseOverview.includes('href="chinese/L07/index.html"') || !chineseOverview.includes("來源待補，不開放") || !chineseOverview.includes("不一樣的故事")) errors.push("國語 L07 overview source-blocked contract 錯誤");
for (const [sequence, title] of chineseBatchTitles) {
  const id = `L${String(sequence).padStart(2, "0")}`;
  const page = await read(`chinese/${id}/index.html`);
  if (!page.includes(title) || !page.includes("fallback-publication-ready · human confirmed")) errors.push(`${id}: 頁面缺少課名或 human-confirmed marker`);
  if (!page.includes("第二階段待產製") || page.includes("NotebookLM 全冊教學簡報")) errors.push(`${id}: artifact boundary 錯誤`);
  if (page.includes("<ruby") || /(?:^|[;{])\s*direction\s*:/.test(page)) errors.push(`${id}: 注音或直式排版 contract 錯誤`);
  const brief = JSON.parse(await read(`data/content-intake/chinese-hanlin-115-l${String(sequence).padStart(2, "0")}-brief.json`));
  const expectedSlots = brief.unit.languageWorkshop.slots.length;
  if ((page.match(/data-slot=/g) || []).length !== expectedSlots) errors.push(`${id}: rendered workshop 欄位數錯誤`);
  if (!page.includes("本課教學提示") || !page.includes("人工核對注音")) errors.push(`${id}: teacher notes 或注音標示未接入`);
}

try {
  const manifest = JSON.parse(await read("data/artifact-manifest.json"));
  if (manifest.notebook?.account !== "xwin20002@gmail.com") errors.push("NotebookLM account 不是 xwin20002@gmail.com");
  if (manifest.artifacts?.find(item => item.id === "overview-video")?.scope !== "historical-114-all-subject-overview-not-unit") errors.push("overview video 必須標為 114 歷史全冊導覽，不得視為 115 逐課影片");
  if (manifest.unitArtifacts?.status !== "115-not-started") errors.push("115 unit artifact 狀態需維持未開始，直到逐課來源已核對");
  if (!manifest.academicYearScope?.includes("114 historical")) errors.push("artifact manifest 必須標示 114 與 115 隔離範圍");
  try {
    const intake = JSON.parse(await read("data/content-intake/chinese-hanlin-114.json"));
    if (intake.units?.length !== 12) errors.push("國語 content intake 必須有 12 課");
    for (const [index, unit] of (intake.units || []).entries()) {
      if (unit.titleStatus !== "verified" || unit.wordBankStatus !== "verified-public-source" || !unit.sourceTermCount) errors.push(`${unit.publisherUnitId}: 國語 source intake 不完整`);
      if (unit.publicLearningLayerStatus !== "ready-wordbank-and-listening") errors.push(`${unit.publisherUnitId}: 公開詞彙／朗讀層尚未完成`);
      const expectedListening = `https://player.hle.com.tw/ech/playlist.html?volume=%E4%BA%8C%E4%B8%8A&unit=L${index + 1}`;
      if (unit.officialListening?.playlistUrl !== expectedListening || unit.officialListening?.status !== "verified-link-only") errors.push(`${unit.publisherUnitId}: 翰林朗讀外連未核對`);
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
