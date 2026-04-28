/* -------------------------------------------------- */
/* CONFIG */
/* -------------------------------------------------- */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLPDmCIqQsfj-NGilxKJDNylTY66wYY4zEc3UAa1tXfURdy4XpmL61mQ6cb_GrWE5A/exec";


/* -------------------------------------------------- */
/* FORM LOGICA */
/* -------------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("cdv-form");
  const cyclistSelect = document.getElementById("cdv-cyclist");
  const sponsorInput = document.getElementById("cdv-sponsor");
  const hmInput = document.getElementById("cdv-hm");
  const rateInput = document.getElementById("cdv-rate");
  const totalBox = document.getElementById("cdv-total");
  const totalAmount = document.getElementById("cdv-total-amount");
  const submitBtn = document.getElementById("cdv-submit");

  function updateTotal() {
    const hm = Number(hmInput.value) || 0;
    const rate = Number(rateInput.value) || 0;
    const total = hm * rate;

    totalAmount.innerText = "€ " + total.toFixed(2).replace(".", ",");
    return total;
  }

  hmInput.addEventListener("input", updateTotal);
  rateInput.addEventListener("input", updateTotal);


  /* -------------------------------------------------- */
  /* SUBMIT HANDLER */
  /* -------------------------------------------------- */

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const cyclist = cyclistSelect.value;
    const sponsor = sponsorInput.value.trim();
    const hm = Number(hmInput.value);
    const rate = Number(rateInput.value);
    const total = updateTotal();

    if (!cyclist || !sponsor || hm <= 0 || rate <= 0) {
      alert("Gelieve alle velden correct in te vullen.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Verzenden...";

    const payload = {
      cyclist,
      sponsor,
      hm,
      rate,
      total
    };

    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);

        submitBtn.innerText = "Verzonden!";
        form.reset();
        updateTotal();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerText = "Bevestigen";
        }, 1500);
      })
      .catch(err => {
        alert("Fout bij verzenden: " + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "Bevestigen";
      });
  });
});
