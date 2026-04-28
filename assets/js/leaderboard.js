(function(){
  // Gebruik exact dezelfde URL als in je script.js
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4wROr20WT07dJcCCQPHNSQed5L4eYapneJO_VNqljvyR5rhemfE2D1hxqnLQuY7WA/exec';
  
  function loadLeaderboard() {
    var container = document.getElementById('cdv-leaderboard-container');
    
    // Fetch data met de action parameter
    fetch(SCRIPT_URL + '?action=leaderboard')
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (data.error) {
          container.innerHTML = 'Fout bij laden: ' + data.error;
          return;
        }
        
        // Sorteer op totaal bedrag (hoogste eerst)
        data.sort(function(a, b) { return b.total - a.total; });
        
        // Render de rijen
        var html = data.map(function(item) {
          return '<div class="cdv-leaderboard-row">' +
                 '<span class="cdv-leaderboard-name">' + item.name + '</span>' +
                 '<span class="cdv-leaderboard-amount">€ ' + item.total.toFixed(2).replace('.', ',') + '</span>' +
                 '</div>';
        }).join('');
        
        container.innerHTML = html || '<p>Nog geen donaties binnengekomen.</p>';
      })
      .catch(function(err) {
        container.innerHTML = 'Kon leaderboard niet laden. Probeer het later opnieuw.';
        console.error(err);
      });
  }

  // Laden zodra pagina gereed is
  window.addEventListener('load', loadLeaderboard);
})();
