var modalSpl = document.getElementById("splodModal");

  var btn = document.getElementById("myModalBtnSpl");

  var span = document.getElementsByClassName("closeSpl")[0];

  btn.onclick = function() {
    modalSpl.style.display = "block";
  }

  span.onclick = function() {
      modalSpl.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalSpl.style.display = "none";
    }
  }