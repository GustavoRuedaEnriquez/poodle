let users = [];

function writeUserInfo(usr) {
    if(usr != undefined) {
        document.getElementById("name_title").innerText = usr.nombre + ' ' + usr.apellido;
        document.getElementById("first_name").value = usr.nombre;
        document.getElementById("last_name").value = usr.apellido;
        document.getElementById("email").value = usr.email;
        document.getElementById("username").value = usr.username;
        document.getElementById("actual").innerHTML = `<span class="pull-left"><strong>Actuales</strong></span> ${usr.actual}`;
        document.getElementById("pending").innerHTML = `<span class="pull-left"><strong>Pendientes</strong></span> ${usr.pending}`;
        document.getElementById("assisted").innerHTML = `<span class="pull-left"><strong>Asistidas</strong></span> ${usr.assisted}`;
    } else {
        alert("Un error ha ocurrido");
    }
}

function init(){
    let token = sessionStorage.getItem("token");
    let user = JSON.parse(sessionStorage.getItem("user"));
    writeUserInfo(user);
}

init();