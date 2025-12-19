(() => {
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

  function ozToPpm(val) {
    return Math.round(val * OZ_GAL_TO_PPM);
  }

  function createRangeBar(spec, measuredPpm) {
    const span = spec.high - spec.low;

    const wrapper = document.createElement("div");

    const bar = document.createElement("div");
    bar.className = "range-bar";

    const fill = document.createElement("div");
    fill.className = "range-fill";

    const optMarker = document.createElement("div");
    optMarker.className = "range-opt";
    optMarker.style.left = `${((spec.opt - spec.low) / span) * 100}%`;

    bar.appendChild(fill);
    bar.appendChild(optMarker);

    if (!isNaN(measuredPpm)) {
      const m = document.createElement("div");
      m.className = "range-measured";
      let pos = (measuredPpm - ozToPpm(spec.low)) /
                (ozToPpm(spec.high) - ozToPpm(spec.low));
      pos = Math.max(0, Math.min(1, pos));
      m.style.left = `${pos * 100}%`;
      bar.appendChild(m);
    }

    const labels = document.createElement("div");
    labels.className = "range-labels";
    labels.innerHTML = `<span>${spec.low}</span><span>${spec.high}</span>`;

    wrapper.appendChild(bar);
    wrapper.appendChild(labels);

    return wrapper;
  }

  function addRow() {
    const tr = document.createElement("tr");

    const chemTd = document.createElement("td");
    const select = document.createElement("select");

    Object.keys(CHEMICAL_SPECS).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    chemTd.appendChild(select);

    const lowTd = document.createElement("td");
    const optTd = document.createElement("td");
    const highTd = document.createElement("td");

    const lowPpmTd = document.createElement("td");
    const optPpmTd = document.createElement("td");
    const highPpmTd = document.createElement("td");
    [lowPpmTd, optPpmTd, highPpmTd].forEach(td => td.className = "readonly");

    const measuredTd = document.createElement("td");
    const measuredInput = document.createElement("input");
    measuredInput.type = "number";
    measuredInput.step = "any";
    measuredTd.appendChild(measuredInput);

    const statusTd = document.createElement("td");
    statusTd.className = "status";

    const rangeTd = document.createElement("td");

    function update() {
      const spec = CHEMICAL_SPECS[select.value];

      lowTd.textContent = spec.low;
      optTd.textContent = spec.opt;
      highTd.textContent = spec.high;

      const lowPpm = ozToPpm(spec.low);
      const optPpm = ozToPpm(spec.opt);
      const highPpm = ozToPpm(spec.high);

      lowPpmTd.textContent = lowPpm;
      optPpmTd.textContent = optPpm;
      highPpmTd.textContent = highPpm;

      const measured = parseFloat(measuredInput.value);

      if (!isNaN(measured)) {
        if (measured >= lowPpm && measured <= highPpm) {
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

      rangeTd.innerHTML = "";
      rangeTd.appendChild(createRangeBar(spec, measured));
    }

    select.addEventListener("change", update);
    measuredInput.addEventListener("input", update);
    update();

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
      measuredTd,
      statusTd,
      rangeTd,
      delTd
    );

    tableBody.appendChild(tr);
  }

  addRowBtn.addEventListener("click", addRow);
  addRow();
})();
