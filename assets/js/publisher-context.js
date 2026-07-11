(() => {
  "use strict";

  const fallbackCatalog = {
    project: {defaultPublisher: "hanlin"},
    publishers: [
      {id: "hanlin", label: "翰林", status: "baseline", enabled: true},
      {id: "kanghsuan", label: "康軒", status: "planned", enabled: true},
      {id: "nani", label: "南一", status: "planned", enabled: true}
    ],
    subjects: [
      {id: "chinese", label: "國語", emoji: "📖", color: "yellow", href: "chinese.html", status: "ready", description: "12課課程地圖、理解重點與原創課堂任務"},
      {id: "math", label: "數學", emoji: "📐", color: "blue", href: "math/index.html", status: "ready", description: "10單元概念地圖、操作活動與自我檢核"},
      {id: "life", label: "生活", emoji: "🌱", color: "green", href: "life/index.html", status: "ready", description: "6主題探究任務、實作活動與生活連結"}
    ]
  };

  const statusLabels = {"awaiting-catalog": "待教材目錄", ready: "可使用", draft: "校對中"};
  const select = document.querySelector("#publisher-select");
  const badge = document.querySelector("#publisher-badge");
  const subjectList = document.querySelector("#subject-list");
  const courseView = document.querySelector("#course-view");
  const compareView = document.querySelector("#compare-view");
  const modeButtons = [...document.querySelectorAll("[data-mode]")];

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, character => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;"})[character]);

  function renderSubjects(subjects, publisher) {
    subjectList.innerHTML = subjects.map(subject => {
      const available = publisher.status === "baseline" && subject.status === "ready";
      const action = available && subject.href
        ? `<a href="${escapeHtml(subject.href)}">進入課程 →</a>`
        : `<span class="disabled-link" aria-disabled="true">${publisher.status === "baseline" ? "內容準備中" : "此版本規劃中"}</span>`;
      return `<article class="card" data-color="${escapeHtml(subject.color)}">
        <span class="status">${escapeHtml(publisher.status === "baseline" ? (statusLabels[subject.status] || subject.status) : "版本規劃中")}</span>
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
      badge.textContent = `${current.label}版${current.status === "baseline" ? "基準" : "規劃中"}`;
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
