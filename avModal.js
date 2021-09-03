var modalAv = document.getElementById("avModal");

  var btn = document.getElementById("myModalBtnAv");

  var span = document.getElementsByClassName("closeAv")[0];

  btn.onclick = function() {
    modalAv.style.display = "block";
  }

  span.onclick = function() {
      modalAv.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalAv.style.display = "none";
    }
  }