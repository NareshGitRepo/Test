function f() {
    var elmnt = document.getElementById("div");
    var y = elmnt.scrollHeight;
    var x = elmnt.scrollWidth;
    document.getElementById ("xyz").innerHTML = "Height: " + y + "px<br>Width: " + x + "px";
  }