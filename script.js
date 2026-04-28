// -----------------------------
// BASIS ELEMENTEN
// -----------------------------
const cyclistSelect = document.getElementById("cdv-cyclist");
const sponsorInput = document.getElementById("cdv-sponsor");
const rateButtons = document.querySelectorAll(".cdv-amount-btn");
const rateInput = document.getElementById("cdv-rate");
const hmDisplay = document.getElementById("cdv-hm");
const hmOf = document.getElementById("cdv-hm-of");
const btnMin = document.getElementById("cdv-btn-min");
const btnPlus = document.getElementById("cdv-btn-plus");
const btnFull = document.getElementById("cdv-btn-full");
const totalDisplay = document.getElementById("cdv-total-amount");
const submitBtn = document.getElementById("cdv-submit");

const bike = document.getElementById("cdv-bike");
const path = document.getElementById("cdv-ride-path");
const pathLength = path.getTotalLength();

let chosenRate = 0;
let chosenHm = 0;
let maxHm = 0;

// -----------------------------
// FIETS POSITIE OP BERG
// -----------------------------
function updateBikePosition() {
  const progress = chosenHm / maxHm;
  const point = path.getPointAtLength(progress * pathLength);

bike.style.transform =
  `translate(${point.x - (bike.offsetWidth * 0.55)}px, ${point.y - (bike.offsetHeight * 0.75)}px) scaleX(-1)`;

// -----------------------------
// BEDRAG KIEZEN
// -----------------------------
rateButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    rateButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (btn.dataset.amount === "custom") {
      rateInput.value = "";
      chosenRate = 0;
      rateInput.focus();
    } else {
      chosenRate = parseFloat(btn.dataset.amount);
      rateInput.value = "";
    }

    updateTotal();
  });
});

rateInput.addEventListener("input", () => {
  chosenRate = parseFloat(rateInput.value) || 0;
  updateTotal();
});

// -----------------------------
// FIETSER KIEZEN
// -----------------------------
cyclistSelect.addEventListener("change", () => {
  maxHm = parseInt(cyclistSelect.selectedOptions[0].dataset.max);
  hmOf.textContent = `max ${maxHm} hm`;

  btnPlus.disabled = false;
  btnMin.disabled = false;
  btnFull.disabled = false;

  updateTotal();
});

// -----------------------------
// HM KNOPPEN
// -----------------------------
btnPlus.addEventListener("click", () => {
  if (chosenHm + 500 <= maxHm) {
    chosenHm += 500;
    hmDisplay.textContent = chosenHm;
    updateBikePosition();
    updateTotal();
  }
});

btnMin.addEventListener("click", () => {
  if (chosenHm - 500 >= 0) {
    chosenHm -= 500;
    hmDisplay.textContent = chosenHm;
    updateBikePosition();
    updateTotal();
  }
});

btnFull.addEventListener("click", () => {
  chosenHm = maxHm;
  hmDisplay.textContent = chosenHm;
  updateBikePosition();
  updateTotal();
});

// -----------------------------
// TOTAAL BEREKENEN
// -----------------------------
function updateTotal() {
  const total = (chosenHm / 500) * chosenRate;
  totalDisplay.textContent = total.toFixed(2).replace(".", ",");

  submitBtn.disabled = !(cyclistSelect.value && sponsorInput.value && chosenRate > 0 && chosenHm > 0);
}

// -----------------------------
// SUBMIT → KUL DONATIEPAGINA
// -----------------------------
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const total = (chosenHm / 500) * chosenRate;
const amountKUL = Math.round(total * 100);

const donationUrl =
  "https://donate.kuleuven.cloud/?cid=80&affectation=CRWD:kuleuven%2FCoduvelo_76&lang=nl_NL&amount=" +
  amountKUL;

window.open(donationUrl, "_blank");
});
