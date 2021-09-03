var modal = document.getElementById("limbusModal");

  var btn = document.getElementById("myModalBtn");

  var span = document.getElementsByClassName("close")[0];

  btn.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
      modal.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }