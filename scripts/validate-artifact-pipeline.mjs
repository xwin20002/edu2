import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const queue = JSON.parse(await readFile(path.join(root, "data/artifact-queue.json"), "utf8"));
const manifest = JSON.parse(await readFile(path.join(root, "data/artifact-manifest.json"), "utf8"));
const errors = [];

if (queue.policy?.maxActiveNotebookLmGenerations !== 1) errors.push("NotebookLM concurrency must remain 1");
if (queue.policy?.maxActiveSubjects !== 1) errors.push("Only one subject may be active");
if (queue.policy?.youtubeVisibility !== "unlisted") errors.push("YouTube visibility must be unlisted");
if (queue.policy?.madeForKids !== true) errors.push("Primary-school uploads must be made-for-kids");

const ids = new Set(queue.jobs.map(job => job.id));
for (const job of queue.jobs) {
  for (const dependency of job.dependsOn || []) {
    if (!ids.has(dependency)) errors.push(`${job.id}: missing dependency ${dependency}`);
  }
  if (job.targetAcademicYear !== 115) errors.push(`${job.id}: wrong academic year`);
  if (!job.sourcePack) errors.push(`${job.id}: missing source pack`);
  try { await access(path.join(root, job.sourcePack)); }
  catch { errors.push(`${job.id}: source pack does not exist`); }
  if (job.type === "video" && job.youtube?.madeForKids !== true) errors.push(`${job.id}: madeForKids must be true`);
}

const active = queue.jobs.filter(job => ["generating", "generation-requested"].includes(job.status));
if (active.length > queue.policy.maxActiveNotebookLmGenerations) errors.push("active NotebookLM jobs exceed policy");
const videoJob = queue.jobs.find(job => job.type === "video");
const slidesPassed = queue.jobs.find(job => job.type === "slide_deck")?.qa?.status === "passed";
if (!slidesPassed && videoJob?.status !== "blocked-by-slides-qa") errors.push("video must remain blocked until slides QA");
if (slidesPassed && !["ready-for-generation", "generation-requested", "generating", "downloaded", "artifact-qa-passed", "artifact-qa-rejected", "youtube-uploaded-unlisted", "site-integrated", "production-verified"].includes(videoJob?.status)) errors.push("video status does not follow passed slides QA");
if (videoJob?.qa?.status === "rejected" && videoJob?.youtube?.status !== "blocked-video-qa-rejected") errors.push("rejected video must remain blocked from YouTube");
if (videoJob?.qa?.status === "rejected" && (videoJob?.youtube?.videoId || videoJob?.youtube?.url)) errors.push("rejected video must not have a YouTube ID or URL");
if (videoJob?.qa?.status === "passed" && !videoJob?.youtube?.videoId) errors.push("passed uploaded video must record its YouTube ID");
if (videoJob?.youtube?.videoId && videoJob?.youtube?.visibility !== "unlisted") errors.push("uploaded teaching video must remain unlisted");
const pilot = manifest.subjectArtifacts?.find(item => item.id === "math-kanghsuan-115-pilot");
const slideJob = queue.jobs.find(job => job.id === "edu2-math-kanghsuan-115-slides");
if (!pilot || pilot.notebook?.id !== slideJob?.notebook?.id) errors.push("manifest and queue notebook IDs differ");
if (pilot?.slideDeck?.remoteArtifactId !== slideJob?.remoteArtifactId) errors.push("manifest and queue slide artifact IDs differ");

const sourcePack = await readFile(path.join(root, "sources/notebooklm/115/math-kanghsuan-115.md"), "utf8");
for (const id of Array.from({ length: 10 }, (_, index) => `U${String(index + 1).padStart(2, "0")}`)) {
  if (!sourcePack.includes(`## ${id} `)) errors.push(`source pack missing ${id}`);
}
for (const page of Array.from({ length: 14 }, (_, index) => String(index + 1).padStart(2, "0"))) {
  try { await access(path.join(root, `assets/notebooklm/115/math-kanghsuan-slides/slide-${page}.jpg`)); }
  catch { errors.push(`web slide missing: ${page}`); }
}
const artifactPage = await readFile(path.join(root, "math/artifacts.html"), "utf8");
if (!artifactPage.includes("Slides and video artifact QA passed") || !artifactPage.includes(videoJob?.youtube?.videoId || "missing-youtube-id")) errors.push("artifact page gate labels or video ID missing");
for (const forbidden of ["課本原文", "習作原題", "教師手冊原文"]) {
  if (sourcePack.includes(forbidden)) errors.push(`source pack contains forbidden marker: ${forbidden}`);
}

if (errors.length) {
  console.error(errors.map(value => `- ${value}`).join("\n"));
  process.exit(1);
}
console.log(`artifact pipeline PASS · jobs=${queue.jobs.length} · active=${active.length} · notebooklm concurrency=1`);
