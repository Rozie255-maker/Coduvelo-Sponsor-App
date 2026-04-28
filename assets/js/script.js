(function(){
  // GOOGLE APPS SCRIPT URL
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw4ZVCkuVhH1GsbtYovUY2vXgGqlzK3YQHyh7K2IEc/dev';
  
  var chosenHm = 0, maxHm = 0;
  var selectedRate = 0;
  var isCustom = false;

  window.cdvSelectAmount = function(amount) {
    var btns = document.querySelectorAll('.cdv-amount-btn');
    btns.forEach(function(b) { b.classList.remove('active'); });
    
    if (amount === 'custom') {
      btns[3].classList.add('active');
      isCustom = true;
      document.getElementById('cdv-custom-wrapper').classList.add('show');
      var customVal = parseFloat(document.getElementById('cdv-custom-amount').value) || 0;
      selectedRate = customVal;
    } else {
      isCustom = false;
      selectedRate = parseFloat(amount);
      document.getElementById('cdv-custom-wrapper').classList.remove('show');
      
      btns.forEach(function(b) {
        if (parseFloat(b.dataset.amount) === parseFloat(amount)) {
          b.classList.add('active');
        }
      });
    }
    cdvUpdateUI();
  };

  window.cdvCustomAmountChange = function() {
    var val = parseFloat(document.getElementById('cdv-custom-amount').value);
    if (!isNaN(val) && val > 0) {
      selectedRate = val;
    } else {
      selectedRate = 0;
    }
    cdvUpdateUI();
  };

  window.cdvCyclistChange = function() {
    var sel = document.getElementById('cdv-cyclist');
    maxHm  = parseInt(sel.options[sel.selectedIndex].dataset.max) || 0;
    chosenHm = 0;
    document.getElementById('cdv-btn-min').disabled  = false;
    document.getElementById('cdv-btn-plus').disabled = false;
    document.getElementById('cdv-btn-full').disabled = false;
    document.getElementById('cdv-btn-full').style.opacity = '1';
    document.getElementById('cdv-bike').style.visibility  = 'visible';
    cdvMoveBike(); 
    cdvUpdateUI();
  };

  window.cdvChangeHm = function(d) {
    if(!maxHm) return;
    chosenHm = Math.max(0, Math.min(maxHm, chosenHm + d));
    cdvMoveBike();
    cdvUpdateUI();
  };

  window.cdvFull = function() {
    if(!maxHm) return;
    chosenHm = maxHm;
    cdvMoveBike(); 
    cdvUpdateUI();
  };

  function getScale() {
    var wrap = document.querySelector('#cdv-app .cdv-mountain-wrap');
    return { x: wrap.offsetWidth / 400, y: wrap.offsetHeight / 140 };
  }

  function positionFlag() {
    var path = document.getElementById('cdv-ride-path');
    var flag = document.getElementById('cdv-finish-node');
    try {
      var s = getScale(), end = path.getPointAtLength(path.getTotalLength());
      flag.style.left = (end.x * s.x - 2) + 'px';
      flag.style.top  = (end.y * s.y - 49) + 'px';
    } catch(e) {}
  }

  function cdvMoveBike() {
    var path = document.getElementById('cdv-ride-path');
    var bike = document.getElementById('cdv-bike');
    try {
      var s     = getScale();
      var ratio = maxHm > 0 ? chosenHm / maxHm : 0;
      var pt    = path.getPointAtLength(path.getTotalLength() * ratio);
      bike.style.left = (pt.x * s.x) + 'px';
      bike.style.top  = (pt.y * s.y) + 'px';
      document.getElementById('cdv-fw').style.opacity = (chosenHm >= maxHm && maxHm > 0) ? '1' : '0';
    } catch(e) {}
  }

  window.cdvUpdateUI = function() {
    var cyclist = document.getElementById('cdv-cyclist').value;
    var name    = document.getElementById('cdv-sponsor-name').value.trim();
    
    document.getElementById('cdv-chosen-hm').innerText = chosenHm.toLocaleString('nl-BE');
    document.getElementById('cdv-hm-of').innerText      = maxHm > 0 ? 'doel: ' + maxHm.toLocaleString('nl-BE') + ' hm' : 'Kies eerst een fietser';
    
    var totalAmount = (chosenHm / 500) * selectedRate;
    document.getElementById('cdv-total').innerText = totalAmount.toFixed(2).replace('.', ',');
    
    if (selectedRate > 0) {
      document.getElementById('cdv-rate-display').innerText = '€ ' + selectedRate.toFixed(2).replace('.', ',') + ' per 500 hm';
    } else {
      document.getElementById('cdv-rate-display').innerText = '';
    }
    
    document.getElementById('cdv-submit').disabled = !(cyclist && name && chosenHm > 0 && selectedRate > 0);
  };

  // Leaderboard fetch functie
  window.cdvLoadLeaderboard = function() {
    var container = document.getElementById('cdv-leaderboard-container');
    if (!container) return; // Stop als het element niet bestaat op de pagina
    
    fetch(SCRIPT_URL + '?action=leaderboard')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.error) {
          container.innerHTML = 'Fout bij laden: ' + data.error;
          return;
        }
        
        // Sorteer op totaal bedrag (hoogste eerst)
        data.sort(function(a, b) { return b.total - a.total; });
        
        var html = data.map(function(item) {
          return '<div class="cdv-leaderboard-row">' +
                 '<span class="cdv-leaderboard-name">' + item.name + '</span>' +
                 '<span class="cdv-leaderboard-amount">€ ' + item.total.toFixed(2).replace('.', ',') + '</span>' +
                 '</div>';
        }).join('');
        
        container.innerHTML = html || '<p>Nog geen donaties.</p>';
      })
      .catch(function(err) {
        container.innerHTML = 'Kon leaderboard niet laden.';
        console.error(err);
      });
  };

  window.cdvConfirm = function() {
    var cyclist = document.getElementById('cdv-cyclist').value;
    var name    = document.getElementById('cdv-sponsor-name').value.trim();
    var totalAmount = (chosenHm / 500) * selectedRate;
    var totalFormatted = totalAmount.toFixed(2);
    
    var btn = document.getElementById('cdv-submit');
    btn.innerText = 'Verwerken...';
    btn.disabled  = true;

    var amountKUL = Math.round(totalAmount * 100);
    window.open(
      'https://donate.kuleuven.cloud/?cid=80&affectation=CRWD:kuleuven%2FCoduvelo_76&lang=nl_NL&amount=' + amountKUL,
      '_blank'
    );
    
    var formData = new FormData();
    formData.append('fietser', cyclist);
    formData.append('sponsor', name);
    formData.append('bedrag', totalFormatted);
    formData.append('hm', chosenHm);
    formData.append('tarief', selectedRate);
    
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
    .then(function() {
      btn.innerText = 'Verzonden! (Betaal in het nieuwe tabblad)';
      // Vernieuw het leaderboard na een geslaagde donatie
      cdvLoadLeaderboard(); 
    })
    .catch(function(err) {
      btn.innerText = 'Fout bij verzenden';
      console.error('Fout bij opslaan:', err);
    });
  };

  document.getElementById('cdv-sponsor-name').addEventListener('input', cdvUpdateUI);
  window.addEventListener('resize', function() { 
    positionFlag(); 
    cdvMoveBike(); 
  });
  
  function init() { 
    positionFlag(); 
    cdvUpdateUI(); 
    cdvLoadLeaderboard(); // Leaderboard laden bij start
  }
  
  if(document.readyState === 'complete') { 
    setTimeout(init, 100);
  } else { 
    window.addEventListener('load', function(){ 
      setTimeout(init, 100); 
    });
  }
})();
