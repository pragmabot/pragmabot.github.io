/**
 * Interactive radar + bar charts for the RAG retrieval ablation study.
 * Uses Chart.js (loaded from CDN in index.html).
 */
(function () {
  "use strict";

  // --- Data ---
  let tasks = [
    "Put apple", "Move candy", "Move egg", "Pick plate",
    "Put ball", "Put orange", "Move paper", "Move screw",
    "Move sushi", "Move grape", "Pick carton", "Pick towel",
  ];

  const raw = {
    "rag-4o":   [18, 18, 18, 18, 14, 16, 15, 14, 18, 18, 18, 15],
    "all-4o":   [18, 18, 18, 18,  3,  9, 15, 17, 15, 18, 17, 12],
    "rand-4o":  [ 1,  6,  3,  2,  1,  0,  3,  5,  5,  3,  4,  4],
    "rag-mini": [18, 14, 18, 18, 10, 13, 11, 11, 14, 17, 18, 15],
    "all-mini": [18, 15, 18, 18,  2,  7,  9,  8,  3,  9, 15,  6],
    "rand-mini":[ 3,  8,  5,  1,  1,  2,  4,  8,  4,  0, 15, 13],
  };

  // Reverse order (keep first element, reverse the rest) so that
  // Chart.js clockwise layout matches the original matplotlib counterclockwise.
  function flipOrder(arr) {
    return [arr[0], ...arr.slice(1).reverse()];
  }

  tasks = flipOrder(tasks);
  for (const k of Object.keys(raw)) {
    raw[k] = flipOrder(raw[k]);
  }

  // Normalize to percentage
  const accuracy = {};
  for (const [k, v] of Object.entries(raw)) {
    accuracy[k] = v.map(x => +(x / 18 * 100).toFixed(1));
  }

  const tokenMeans = {
    "rag-4o": 1204.3, "all-4o": 8997.8, "rand-4o": 1139.5,
    "rag-mini": 1211.1, "all-mini": 8997.8, "rand-mini": 1138.2,
  };

  const timeMeans = {
    "rag-4o": 9.84, "all-4o": 10.60, "rand-4o": 10.19,
    "rag-mini": 6.76, "all-mini": 7.20, "rand-mini": 7.23,
  };

  // --- Colors (matching original seaborn default palette) ---
  const palette = {
    "rag-4o":    { bg: "rgba(31,119,180,0.15)",  border: "rgb(31,119,180)"  },
    "all-4o":    { bg: "rgba(255,127,14,0.15)",   border: "rgb(255,127,14)"  },
    "rand-4o":   { bg: "rgba(44,160,44,0.15)",    border: "rgb(44,160,44)"   },
    "rag-mini":  { bg: "rgba(214,39,40,0.15)",    border: "rgb(214,39,40)"   },
    "all-mini":  { bg: "rgba(148,103,189,0.15)",  border: "rgb(148,103,189)" },
    "rand-mini": { bg: "rgba(140,86,75,0.15)",    border: "rgb(140,86,75)"   },
  };

  const labels4o   = ["rag-4o", "all-4o", "rand-4o"];
  const labelsMini = ["rag-mini", "all-mini", "rand-mini"];
  const allMethods = labels4o.concat(labelsMini);

  // --- Helpers ---
  function radarDatasets(methods) {
    return methods.map(m => ({
      label: m,
      data: accuracy[m],
      backgroundColor: palette[m].bg,
      borderColor: palette[m].border,
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: palette[m].border,
    }));
  }

  function createRadar(canvasId, methods, title) {
    const ctx = document.getElementById(canvasId);
    return new Chart(ctx, {
      type: "radar",
      data: { labels: tasks, datasets: radarDatasets(methods) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: title, font: { size: 14, weight: "bold" }, padding: { bottom: 6 } },
          legend: {
            position: "top",
            labels: { usePointStyle: true, pointStyle: "line", padding: 10, font: { size: 11 } },
          },
          tooltip: {
            callbacks: {
              label: function (item) {
                return item.dataset.label + ": " + item.parsed.r.toFixed(1) + "%";
              }
            }
          }
        },
        scales: {
          r: {
            min: 0, max: 100,
            ticks: { stepSize: 25, backdropColor: "transparent", font: { size: 9 } },
            pointLabels: { font: { size: 10 }, padding: 2 },
            grid: { color: "rgba(0,0,0,0.08)" },
            angleLines: { color: "rgba(0,0,0,0.08)" },
          }
        },
        interaction: { mode: "nearest", intersect: false },
      }
    });
  }

  function createBar(canvasId, dataMap, title, yLabel) {
    const ctx = document.getElementById(canvasId);
    return new Chart(ctx, {
      type: "bar",
      data: {
        labels: allMethods,
        datasets: [{
          data: allMethods.map(m => dataMap[m]),
          backgroundColor: allMethods.map(m => palette[m].bg.replace("0.15", "0.65")),
          borderColor: allMethods.map(m => palette[m].border),
          borderWidth: 1.5,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: title, font: { size: 14, weight: "bold" }, padding: { bottom: 6 } },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (item) {
                return item.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 1 });
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 35 },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: yLabel, font: { size: 11 } },
            ticks: { font: { size: 10 } },
            grid: { color: "rgba(0,0,0,0.06)" },
          }
        },
      }
    });
  }

  // --- Init on DOM ready ---
  function init() {
    createRadar("radar-4o",   labels4o,   "First-Action Accuracy \u2014 GPT-4o");
    createBar("bar-tokens", tokenMeans, "Prompt Tokens (\u2193)", "Token Count");
    createRadar("radar-mini", labelsMini, "First-Action Accuracy \u2014 GPT-4o-mini");
    createBar("bar-time",   timeMeans,  "Response Time (\u2193)", "Time [s]");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
