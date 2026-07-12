(() => {
  "use strict";

  const fallbackCatalog = {
    project: {defaultPublisher: "school-baseline-115"},
    publishers: [
      {id: "school-baseline-115", label: "115 學年校訂組合", status: "baseline", enabled: true},
      {id: "hanlin", label: "翰林", status: "planned", enabled: true},
      {id: "kanghsuan", label: "康軒", status: "planned", enabled: true},
      {id: "nani", label: "南一", status: "planned", enabled: true}
    ],
    subjects: [
      {id: "chinese", label: "國語", emoji: "📖", color: "yellow", publisher: "hanlin", href: null, status: "awaiting-catalog", description: "115 翰林版已確認；等待正式目錄與逐課來源重新蒐集"},
      {id: "math", label: "數學", emoji: "📐", color: "blue", publisher: "kanghsuan", href: null, status: "awaiting-catalog", description: "115 康軒版已確認；等待正式目錄、單元與教學來源重新蒐集"},
      {id: "life", label: "生活", emoji: "🌱", color: "green", publisher: "nani", href: null, status: "awaiting-catalog", description: "115 南一版已確認；等待正式目錄、主題與教學來源重新蒐集"}
    ]
  };

  const statusLabels = {"awaiting-catalog": "待115正式目錄", ready: "可使用", draft: "校對中"};
  const select = document.querySelector("#publisher-select");
  const badge = document.querySelector("#publisher-badge");
  const subjectList = document.querySelector("#subject-list");
  const courseView = document.querySelector("#course-view");
  const compareView = document.querySelector("#compare-view");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"})[character]);

  function renderSubjects(subjects, publisher) {
    subjectList.innerHTML = subjects.map(subject => {
      const matchesPublisher = publisher.id === "school-baseline-115" || publisher.id === subject.publisher;
      const available = matchesPublisher && subject.status === "ready";
      const action = available && subject.href
        ? `<a href="${escapeHtml(subject.href)}">進入課程 →</a>`
        : `<span class="disabled-link" aria-disabled="true">${matchesPublisher ? "115內容準備中" : "非本校選用版本"}</span>`;
      return `<article class="card" data-color="${escapeHtml(subject.color)}">
        <span class="status">${escapeHtml(matchesPublisher ? (statusLabels[subject.status] || subject.status) : "非本校選用")}</span>
        <span class="emoji" aria-hidden="true">${escapeHtml(subject.emoji)}</span>
        <h3>${escapeHtml(subject.label)}</h3>
        <p>${escapeHtml(subject.description)}</p>${action}
      </article>`;
    }).join("");
  }

  function setMode(mode) {
    const isCompare = mode === "compare";
    courseView.hidden = isCompare;
    compareView.classList.toggle("active", isCompare);
    modeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
  }

  function initialize(catalog) {
    const publishers = catalog.publishers.filter(publisher => publisher.enabled);
    select.innerHTML = publishers.map(publisher => `<option value="${escapeHtml(publisher.id)}">${escapeHtml(publisher.label)}${publisher.status === "baseline" ? "（基準）" : "（規劃中）"}</option>`).join("");
    const stored = localStorage.getItem("edu2.publisher");
    select.value = publishers.some(publisher => publisher.id === stored) ? stored : catalog.project.defaultPublisher;

    const updatePublisher = () => {
      const current = publishers.find(publisher => publisher.id === select.value) || publishers[0];
      badge.textContent = `${current.label}${current.status === "baseline" ? "基準" : "規劃中"}`;
      localStorage.setItem("edu2.publisher", current.id);
      renderSubjects(catalog.subjects, current);
    };

    select.addEventListener("change", updatePublisher);
    modeButtons.forEach(button => button.addEventListener("click", () => setMode(button.dataset.mode)));
    updatePublisher();
    setMode("course");
  }

  fetch("data/catalog.json")
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(initialize)
    .catch(error => {
      console.warn("Catalog unavailable; using embedded foundation data.", error);
      initialize(fallbackCatalog);
    });
})();
