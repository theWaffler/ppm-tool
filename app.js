(() => {
  const buildDateEl = document.getElementById("buildDate");
  buildDateEl.textContent = new Date().toISOString();

  const btn = document.getElementById("testButton");
  const out = document.getElementById("testOutput");

  btn.addEventListener("click", () => {
    out.textContent = "UI is running. Next step: table + oz/gal → ppm math + exports.";
  });
})();
