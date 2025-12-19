(() => {
  // ---- constants ----
  const OZ_GAL_TO_PPM = (28.3495 * 1000) / 3.78541;

  const CHEMICAL_SPECS = {
    "Nickel Sulfate (Bright Nickel)": { low: 30, opt: 40, high: 45 },
    "Nickel Chloride (Bright Nickel)": { low: 10, opt: 12, high: 15 },
    "Boric Acid (Nickel Baths)": { low: 5, opt: 7, high: 8 },

    "Nickel Sulfate (Satin Nickel)": { low: 24, opt: 35, high: 45 },
    "Nickel Chloride (Satin Nickel)": { low: 4, opt: 5, high: 6 },
    "Boric Acid (Satin Nickel)": { low: 6, opt: 7.5, high: 8 },

    "Copper Sulfate (Acid Copper)": { low: 26.4, opt: 32.0, high: 37.0 },

    "Tri-Chrome +3": { low: 3.2, opt: 3.6, high: 3.8 }
  };

  const tableBody = document.querySelector("#chemTable tbody");
  const addRowBtn = document.getElementById("addRow");
  document.getElementById("buildDate").textContent = new Date().toISOString();

  function ozGalToPpm(ozGal) {
    if (isNaN(ozGal)) return "";
    return Math.round(ozGal * OZ_GAL_TO_PPM);
  }

  function addRow() {
    const tr = document.createElement("tr");

    // Chemical dropdown
    const chemTd = document.createElement("td");
    const select = document.createElement("select");

    Object.keys(CHEMICAL_SPECS).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    chemTd.appendChild(select);

    // Spec oz/gal
    const lowTd = document.createElement("td");
    const optTd = document.createElement("td");
    const highTd = document.createElement("td");

    // Spec ppm
    const lowPpmTd = document.createElement("td");
    const optPpmTd = document.createElement("td");
    const highPpmTd = document.createElement("td");
    [lowPpmTd, optPpmTd, highPpmTd].forEach(td => td.className = "readonly");

    // Measured oz/gal (INPUT)
    const measOzTd = document.createElement("td");
    const measOzInput = document.createElement("input");
    measOzInput.type = "number";
    measOzInput.step = "any";
    measOzTd.appendChild(measOzInput);

    // Measured ppm (DERIVED)
    const measPpmTd = document.createElement("td");
    measPpmTd.className = "readonly";

    // Status
    const statusTd = document.createElement("td");
    statusTd.className = "status";

    function update() {
      const spec = CHEMICAL_SPECS[select.value];

      // Spec oz/gal
      lowTd.textContent = spec.low;
      optTd.textContent = spec.opt;
      highTd.textContent = spec.high;

      // Spec ppm
      const lowPpm = ozGalToPpm(spec.low);
      const optPpm = ozGalToPpm(spec.opt);
      const highPpm = ozGalToPpm(spec.high);

      lowPpmTd.textContent = lowPpm;
      optPpmTd.textContent = optPpm;
      highPpmTd.textContent = highPpm;

      // Measured
      const measuredOz = parseFloat(measOzInput.value);
      const measuredPpm = ozGalToPpm(measuredOz);

      measPpmTd.textContent = measuredPpm;

      if (!isNaN(measuredPpm)) {
        if (measuredPpm >= lowPpm && measuredPpm <= highPpm) {
          statusTd.textContent = "IN RANGE";
          statusTd.className = "status ok";
        } else {
          statusTd.textContent = "OUT OF RANGE";
          statusTd.className = "status bad";
        }
      } else {
        statusTd.textContent = "";
        statusTd.className = "status";
      }
    }

    select.addEventListener("change", update);
    measOzInput.addEventListener("input", update);
    update();

    // Delete
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
      measOzTd,
      measPpmTd,
      statusTd,
      delTd
    );

    tableBody.appendChild(tr);
  }

  addRowBtn.addEventListener("click", addRow);
  addRow();
})();
