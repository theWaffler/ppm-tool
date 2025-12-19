(() => {
  // ---------------- constants ----------------
  const OZ_GAL_TO_PPM = (28.3495 * 1000) / 3.78541;

  // ---------------- elements ----------------
  const tableBody = document.querySelector("#chemTable tbody");
  const addRowBtn = document.getElementById("addRow");
  const buildDateEl = document.getElementById("buildDate");

  buildDateEl.textContent = new Date().toISOString();

  // ---------------- helpers ----------------
  function ozToPpm(val) {
    const n = parseFloat(val);
    if (isNaN(n)) return "";
    return Math.round(n * OZ_GAL_TO_PPM);
  }

  function createCellInput(onInput) {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.addEventListener("input", onInput);
    td.appendChild(input);
    return td;
  }

  function createReadonlyCell() {
    const td = document.createElement("td");
    td.className = "readonly";
    return td;
  }

  // ---------------- row creation ----------------
  function addRow() {
    const tr = document.createElement("tr");

    const chemTd = document.createElement("td");
    const chemInput = document.createElement("input");
    chemInput.placeholder = "Chemical name";
    chemTd.appendChild(chemInput);

    const lowPpmTd = createReadonlyCell();
    const optPpmTd = createReadonlyCell();
    const highPpmTd = createReadonlyCell();

    const lowTd = createCellInput(() => {
      lowPpmTd.textContent = ozToPpm(lowTd.firstChild.value);
    });

    const optTd = createCellInput(() => {
      optPpmTd.textContent = ozToPpm(optTd.firstChild.value);
    });

    const highTd = createCellInput(() => {
      highPpmTd.textContent = ozToPpm(highTd.firstChild.value);
    });

    const delTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "✕";
    delBtn.className = "delete";
    delBtn.onclick = () => tr.remove();
    delTd.appendChild(delBtn);

    tr.append(
      chemTd,
      lowTd,
      optTd,
      highTd,
      lowPpmTd,
      optPpmTd,
      highPpmTd,
      delTd
    );

    tableBody.appendChild(tr);
  }

  // ---------------- events ----------------
  addRowBtn.addEventListener("click", addRow);

  // start with one empty row
  addRow();
})();
