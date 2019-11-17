let users = [];

function writeUserInfo() {
    /* Temporal part */
    let usr = users.find((item) => item.id = 1);
    /*****************/
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
        alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido");
    }
}

function init(){
    xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:3000/users');
    xhr.setRequestHeader('x-auth',localStorage.token);
    xhr.setRequestHeader('x-user-token',localStorage.userToken);
    xhr.send()
    xhr.onload = function (){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido");
        }else{
            users = JSON.parse(xhr.response);
            writeUserInfo();
        }
    }
}

init();