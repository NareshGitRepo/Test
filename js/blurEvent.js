/*// Html level
    function f2()
    {
       alert("input value field lost focus");
    } */
  -->
//js level
    document.getElementById("uname").onblur=function(){f2()};
    function f2()
    {
        alert("Input value field lost focus");
    }