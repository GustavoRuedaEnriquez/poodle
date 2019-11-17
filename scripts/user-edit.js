let users = [];

let saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click",updateUserInfo);

function updateUserInfo(e) {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let password_validation = document.getElementById("password2");

    if(password != password2) {
        password_validation.setCustomValidity("Las contraseñas no son iguales.");
        return;
    }
           
    e.preventDefault();

    let str = JSON.stringify({
        'nombre' : first_name,
        'apellido' : last_name,
        'username' : username,
        'password' : password
    })

    let xhr = new XMLHttpRequest();
    /* Temporal part */
    xhr.open('PATCH', 'http://localhost:3000/users/1');
    /*****************/
    xhr.setRequestHeader('content-type','application/json');
    xhr.send(str);
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido.");
        }else{
            location.reload();
        }
    }

}

function writeUserInfo() {
    /* Temporal part */
    let usr = users.find((item) => item.id = 1);
    /*****************/
    if(usr != undefined) {
        document.getElementById("name_title").innerText = usr.nombre + ' ' + usr.apellido;
        document.getElementById("first_name").value = usr.nombre;
        document.getElementById("last_name").value = usr.apellido;
        document.getElementById("username").value = usr.username;
        document.getElementById("password").value = usr.password;
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