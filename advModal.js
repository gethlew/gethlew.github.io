var modalAdv1 = document.getElementById("advModal1");

  var btn = document.getElementById("btn1");

  var span = document.getElementsByClassName("closeADV1")[0];

  btn.onclick = function() {
    modalAdv1.style.display = "block";
  }

  span.onclick = function() {
      modalAdv1.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalAdv1.style.display = "none";
    }
  }