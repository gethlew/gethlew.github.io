var modalWg = document.getElementById("wgModal");

  var btn = document.getElementById("myModalBtnWg");

  var span = document.getElementsByClassName("closeWg")[0];

  btn.onclick = function() {
    modalWg.style.display = "block";
  }

  span.onclick = function() {
      modalWg.style.display = "none";
    }

  window.onlick = function(event) {
    if (event.target == modal) {
      modalWg.style.display = "none";
    }
  }