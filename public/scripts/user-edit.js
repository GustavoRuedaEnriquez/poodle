let users = [];

let saveBtn = document.querySelector("#saveBtn");
saveBtn.addEventListener("click",updateUserInfo);

function updateUserInfo(e) {
    let user = JSON.parse(sessionStorage.getItem("user"));
    let email = user.email;

    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let password2 = document.getElementById("password2").value;
    let password_validation = document.getElementById("password2");
    let url =   document.getElementById("url-input").value;

    if(password != password2) {
        password_validation.setCustomValidity("Las contraseñas no son iguales.");
        return;
    }
           
    e.preventDefault();

    let str = JSON.stringify({
        'nombre' : first_name,
        'apellido' : last_name,
        'username' : username,
        'password' : password,
        'image': url
    })

    let xhr = new XMLHttpRequest();

    xhr.open('PATCH', '/api/user/' + email);

    xhr.setRequestHeader('content-type','application/json');
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"));

    xhr.send(str);
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido.");
        }else{
            let response = JSON.parse(xhr.responseText);
            sessionStorage.setItem("user",JSON.stringify(response.result));
            location.href = 'user.html';
        }
    }

}

function writeUserInfo(usr) {
    if(usr != undefined) {
        document.getElementById("name_title").innerText = usr.nombre + ' ' + usr.apellido;
        document.getElementById("first_name").value = usr.nombre;
        document.getElementById("last_name").value = usr.apellido;
        document.getElementById("username").value = usr.username;
        document.getElementById("password").value = usr.password;
        document.getElementById("avatar-image").src = usr.image;
        document.getElementById("actual").innerHTML = `<span class="pull-left"><strong>Actuales</strong></span> ${usr.actual}`;
        document.getElementById("pending").innerHTML = `<span class="pull-left"><strong>Pendientes</strong></span> ${usr.pending}`;
        document.getElementById("assisted").innerHTML = `<span class="pull-left"><strong>Asistidas</strong></span> ${usr.assisted}`;
        document.getElementById("url-input").value = usr.image;
    } else {
        alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido");
    }
}

function init(){
    let token = sessionStorage.getItem("token");
    let user = JSON.parse(sessionStorage.getItem("user"));
    writeUserInfo(user);
}

init();