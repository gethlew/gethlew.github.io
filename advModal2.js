var modalAdv2 = document.getElementById("advModal2");

  var btn = document.getElementById("btn2");

  var span = document.getElementsByClassName("closeADV2")[0];

  btn.onclick = function() {
    modalAdv2.style.display = "block";
  }

  span.onclick = function() {
      modalAdv2.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalAdv2.style.display = "none";
    }
  }