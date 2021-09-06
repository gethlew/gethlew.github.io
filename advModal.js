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

var modalAdv3 = document.getElementById("advModal3");

  var btn = document.getElementById("btn3");

  var span = document.getElementsByClassName("closeADV3")[0];

  btn.onclick = function() {
    modalAdv3.style.display = "block";
  }

  span.onclick = function() {
      modalAdv3.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalAdv3.style.display = "none";
    }
  }