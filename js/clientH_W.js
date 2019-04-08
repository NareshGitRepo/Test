function myFunction() {
    var elmnt = document.getElementById("div");
    var txt = "";
    txt += "Height including padding: " + elmnt.clientHeight + "px<br>";
    txt += "Height including padding and border: " + elmnt.offsetHeight + "px<br>";
    txt += "Width including padding: " + elmnt.clientWidth + "px<br>";
    txt += "Width including padding and border: " + elmnt.offsetWidth + "px";
   document.getElementById("abc").innerHTML = txt;
}