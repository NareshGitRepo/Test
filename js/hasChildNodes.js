function f1() {
    var list = document.getElementById("abc").hasChildNodes();
    document.getElementById("xyz").innerHTML = list;
    }

/*
function f1() {
    var list = document.getElementById("abc");
    
    if (list.hasChildNodes()) {
      list.removeChild(list.childNodes[2]);
    }
}*/