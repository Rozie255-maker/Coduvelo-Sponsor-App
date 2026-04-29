(function () {
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTE7NyTjpnnJOzU3fAazosEDDilFDShzvmYwkEZHxtLw687CnGplhi5_wZ4QYH0VZA/exec';
  
  function loadLeaderboard() {
    var container = document.getElementById('cdv-leaderboard-container');
    
    fetch(SCRIPT_URL + '?action=leaderboard')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          container.innerHTML = '<p>Fout: ongeldige data ontvangen.</p>';
          return;
        }
        
        if (data.length === 0) {
          container.innerHTML = '<p>Nog geen donaties binnengekomen.</p>';
          return;
        }
        
        // Sort by total amount (highest first)
        data.sort(function (a, b) {
          return b.total - a.total;  // ✅ WAS: [b.total](http://b.total) - [a.total](http://a.total)
        });
        
        // Generate HTML for each row
        var html = data
          .map(function (item) {
            return (
              '<div class="cdv-leaderboard-row">' +
              '<span class="cdv-leaderboard-name">' +
              item.name +  // ✅ WAS: [item.name](http://item.name)
              '</span>' +
              '<span class="cdv-leaderboard-amount">€ ' +
              item.total.toFixed(2).replace('.', ',') +  // ✅ WAS: [item.total](http://item.total).toFixed(2)
              '</span>' +
              '</div>'
            );
          })
          .join('');
        
        container.innerHTML = html;
      })
      .catch(function (err) {
        container.innerHTML = '<p class="error">Kon leaderboard niet laden. Probeer het later opnieuw.</p>';
        console.error('Leaderboard error:', err);
      });
  }
  
  // Load leaderboard when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLeaderboard);
  } else {
    loadLeaderboard();
  }
})();
