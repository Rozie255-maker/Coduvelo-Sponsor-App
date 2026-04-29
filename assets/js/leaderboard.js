(function () {
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTE7NyTjpnnJOzU3fAazosEDDilFDShzvmYwkEZHxtLw687CnGplhi5_wZ4QYH0VZA/exec';

  function loadLeaderboard() {
    var container = document.getElementById('cdv-leaderboard-container');

    fetch(SCRIPT_URL + '?action=leaderboard')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) {
          container.innerHTML = 'Fout: ongeldige data ontvangen.';
          return;
        }

        data.sort(function (a, b) {
          return b.total - a.total;
        });

        var html = data
          .map(function (item) {
            return (
              '<div class="cdv-leaderboard-row">' +
              '<span class="cdv-leaderboard-name">' +
              item.name +
              '</span>' +
              '<span class="cdv-leaderboard-amount">€ ' +
              item.total.toFixed(2).replace('.', ',') +
              '</span>' +
              '</div>'
            );
          })
          .join('');

        container.innerHTML =
          html || '<p>Nog geen donaties binnengekomen.</p>';
      })
      .catch(function (err) {
        container.innerHTML =
          'Kon leaderboard niet laden. Probeer het later opnieuw.';
        console.error(err);
      });
  }

  window.addEventListener('load', loadLeaderboard);
})();
