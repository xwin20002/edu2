(() => {
  const total = 14;
  let page = 1;
  const image = document.querySelector("#slide");
  const counter = document.querySelector("#counter");
  const progress = document.querySelector("#progress");
  const viewer = document.querySelector("#viewer");
  const render = next => {
    page = Math.max(1, Math.min(total, next));
    image.src = `../assets/notebooklm/115/math-kanghsuan-slides/slide-${String(page).padStart(2, "0")}.jpg`;
    image.alt = `二上數學探險日誌第 ${page} 頁`;
    counter.textContent = `${page} / ${total}`;
    progress.value = String(page);
  };
  document.querySelector("#prev").addEventListener("click", () => render(page - 1));
  document.querySelector("#next").addEventListener("click", () => render(page + 1));
  progress.addEventListener("input", event => render(Number(event.target.value)));
  document.querySelector("#fullscreen").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else viewer.requestFullscreen();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") render(page - 1);
    if (event.key === "ArrowRight") render(page + 1);
  });
})();
