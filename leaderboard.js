<script src="leaderboard.js"></script>
/* -------------------------------------------------- */
/* LEADERBOARD – CONFIG */
/* -------------------------------------------------- */

// Vervang door jouw Apps Script URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLPDmCIqQsfj-NGilxKJDNylTY66wYY4zEc3UAa1tXfURdy4XpmL61mQ6cb_GrWE5A/exec';


/* -------------------------------------------------- */
/* LOAD FUNCTION */
/* -------------------------------------------------- */

function lbLoad() {
  const body     = document.getElementById('lb-body');
  const totalBox = document.getElementById('lb-total');
  const btn      = document.getElementById('lb-btn');
  const dateBox  = document.getElementById('lb-date');

  // Reset UI
  body.innerHTML         = '<div class="lb-empty">Gegevens ophalen...</div>';
  totalBox.style.display = 'none';
  btn.disabled           = true;
  btn.innerText          = '↻ Laden...';

  // Datum
  const now = new Date();
  dateBox.innerText =
    'Stand van ' + now.toLocaleDateString('nl-BE', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });

  // Fetch data
  fetch(`${SCRIPT_URL}?action=leaderboard&t=${Date.now()}`)
    .then(res => {
      if (!res.ok) throw new Error('HTTP error: ' + res.status);
      return res.text();
    })
    .then(text => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Ongeldige JSON: ' + e.message);
      }

      if (data.error) {
        throw new Error(data.error + (data.message ? ': ' + data.message : ''));
      }

      btn.disabled  = false;
      btn.innerText = '↻ Vernieuwen';

      lbRender(data, body, totalBox);
    })
    .catch(error => {
      btn.disabled  = false;
      btn.innerText = '↻ Vernieuwen';

      body.innerHTML =
        '<div class="lb-empty">Kon geen verbinding maken.</div>' +
        '<div class="lb-error">' +
        '<strong>Fout:</strong> ' + error.message + '<br><br>' +
        '<strong>Controleer:</strong><br>' +
        '• Is de Google Apps Script URL correct?<br>' +
        '• Is de deployment ingesteld op "Anyone"?<br>' +
        '• Bestaat de "Sponsoring" tab in je spreadsheet?' +
        '</div>';
    });
}


/* -------------------------------------------------- */
/* RENDER FUNCTION */
/* -------------------------------------------------- */

function lbRender(data, body, totalBox) {

  if (!Array.isArray(data)) {
    body.innerHTML =
      '<div class="lb-empty">Ongeldige data ontvangen.</div>' +
      '<div class="lb-error">Data moet een array zijn. Ontvangen: ' + typeof data + '</div>';
    return;
  }

  const rows = data
    .filter(r => r.name && r.total > 0)
    .sort((a, b) => b.total - a.total);

  if (rows.length === 0) {
    body.innerHTML = '<div class="lb-empty">Nog geen sponsoring geregistreerd.</div>';
    return;
  }

  const maxEur     = rows[0].total || 1;
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  totalBox.style.display = 'flex';
  document.getElementById('lb-total-val').innerText =
    '€ ' + grandTotal.toFixed(2).replace('.', ',');

  const medals  = ['🥇', '🥈', '🥉'];
  const classes = ['gold', 'silver', 'bronze'];

  let html = '';

  rows.forEach((r, i) => {
    const cls   = i < 3 ? classes[i] : '';
    const medal = i < 3 ? `<span class="lb-medal">${medals[i]}</span>` : '';
    const pct   = Math.round((r.total / maxEur) * 100);

    html += `
      <div class="lb-row ${cls}" data-pct="${pct}">
        <div class="lb-rank ${cls}">${i + 1}</div>
        <div class="lb-name">${medal}${r.name}</div>
        <div class="lb-bar-outer">
          <div class="lb-bar-fill" style="width:0%"></div>
        </div>
        <div class="lb-amount">€ ${r.total.toFixed(2).replace('.', ',')}</div>
      </div>
    `;
  });

  body.innerHTML = html;

  // Animate bars
  setTimeout(() => {
    body.querySelectorAll('.lb-row').forEach(row => {
      row.querySelector('.lb-bar-fill').style.width = row.dataset.pct + '%';
    });
  }, 80);
}


/* -------------------------------------------------- */
/* AUTO-LOAD */
/* -------------------------------------------------- */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', lbLoad);
} else {
  setTimeout(lbLoad, 100);
}
