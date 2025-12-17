/* ================================
   DATA MODEL
================================= */

const itemDatabase = {
  solidFood: {
    Rice: 2500,
    Wheat: 1300,
    Vegetables: 300,
    Pulses: 400
  },
  liquidFood: {
    Milk: 1000,
    Juice: 200
  },
  personal: {
    Bathing: 60,
    Gardening: 15,
    "Car Washing": 200,
    "Dish Washing": 15,
    "Drinking Water": 1
  },
  clothing: {
    "Cotton Clothes": 2700,
    "Normal Clothes": 1800,
    Jeans: 7600
  }
};

/* ================================
   ENTRY VALIDATION
================================= */

function enterApp() {
  const name = document.getElementById("username").value.trim();
  const human = document.getElementById("human").checked;
  const lang = document.getElementById("lang").value;

  if (!name || !human) {
    alert("Please enter your name and verify you are human.");
    return;
  }

  document.getElementById("entry").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  document.getElementById("welcome").innerText =
    lang === "hi" ? `स्वागत है, ${name}` : `Welcome, ${name}`;
}

/* ================================
   INSIGHT ENGINE
================================= */

function generateInsight(solid, liquid, personal, clothes) {
  const categories = {
    "Solid Food": solid,
    "Liquid Food": liquid,
    "Personal Use": personal,
    "Clothing": clothes
  };

  const highest = Object.keys(categories)
    .reduce((a, b) => categories[a] > categories[b] ? a : b);

  if (categories[highest] > 5000) {
    return `High water consumption detected in ${highest}. 
    Reducing usage here can significantly lower your overall footprint.`;
  }

  return `${highest} contributes the most to your water footprint. 
  Efficient usage can help conserve water.`;
}

/* ================================
   CALCULATION + RESULT UNIT LOGIC
================================= */

let chart;

function calculate() {

  /* Solid Food */
  const solidItem = document.getElementById("solidFood").selectedOptions[0].text;
  const solidQty = Number(document.getElementById("solidQty").value) || 0;
  const solid = itemDatabase.solidFood[solidItem]
    ? itemDatabase.solidFood[solidItem] * solidQty
    : 0;

  /* Liquid Food */
  const liquidItem = document.getElementById("liquidFood").selectedOptions[0].text;
  let liquidQty = Number(document.getElementById("liquidQty").value) || 0;
  const liquidUnit = document.getElementById("liquidUnit").value;
  if (liquidUnit === "mL") liquidQty /= 1000;

  const liquid = itemDatabase.liquidFood[liquidItem]
    ? itemDatabase.liquidFood[liquidItem] * liquidQty
    : 0;

  /* Personal */
  const personalItem = document.getElementById("personal").selectedOptions[0].text;
  const personalQty = Number(document.getElementById("personalQty").value) || 0;
  const personal = itemDatabase.personal[personalItem]
    ? itemDatabase.personal[personalItem] * personalQty
    : 0;

  /* Clothing */
  const clothesItem = document.getElementById("clothes").selectedOptions[0].text;
  const clothesQty = Number(document.getElementById("clothesQty").value) || 0;
  const clothes = itemDatabase.clothing[clothesItem]
    ? itemDatabase.clothing[clothesItem] * clothesQty
    : 0;

  /* TOTAL (Always in Litres internally) */
  let total = solid + liquid + personal + clothes;

  /* RESULT UNIT SELECTION */
  const resultUnit = document.getElementById("resultUnit").value;
  let factor = 1;
  let unitLabel = "Litres";

  if (resultUnit === "mL") {
    factor = 1000;
    unitLabel = "Millilitres";
  }

  /* Risk */
  let risk = "Low";
  if (total > 12000) risk = "High";
  else if (total > 7000) risk = "Moderate";

  /* Insight */
  const insight = generateInsight(solid, liquid, personal, clothes);

  /* OUTPUT */
  const result = document.getElementById("result");
  result.classList.remove("hidden");
  result.innerHTML = `
    <b>User:</b> ${document.getElementById("username").value}<br><br>
    <b>Solid Food:</b> ${(solid * factor).toFixed(2)} ${unitLabel}<br>
    <b>Liquid Food:</b> ${(liquid * factor).toFixed(2)} ${unitLabel}<br>
    <b>Personal Use:</b> ${(personal * factor).toFixed(2)} ${unitLabel}<br>
    <b>Clothing:</b> ${(clothes * factor).toFixed(2)} ${unitLabel}<br><br>
    <b>Total Water Footprint:</b> ${(total * factor).toFixed(2)} ${unitLabel}<br>
    <b>Water Scarcity Risk Level:</b> ${risk}<br><br>
    <b>System Insight:</b> ${insight}
  `;

  /* GRAPH */
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Solid Food", "Liquid Food", "Personal Use", "Clothing"],
      datasets: [{
        label: `Water Footprint (${unitLabel})`,
        data: [
          solid * factor,
          liquid * factor,
          personal * factor,
          clothes * factor
        ],
        backgroundColor: "#000"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
