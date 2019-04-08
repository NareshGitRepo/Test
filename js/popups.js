function Alert()
{
    alert(location.hostname);
}

function Confirm()
  {
    var txt;
    var press = confirm("Press a button!");
    if (press == true) {
       txt = "You pressed OK!";
    } 
    else {
       txt = "You pressed Cancel!";
    }
  document.getElementById("Confirm").innerHTML = txt;
}

function Prompt() {
    var txt;
    var person = prompt("Please enter your name:", "JavaScript");
    if (person == null || person == "") {
      txt = "User cancelled the prompt.";
    } 
    else {
      txt = "Hello " + person + "! How are you today?";
    }
    document.getElementById("Prompt").innerHTML = txt;
}

