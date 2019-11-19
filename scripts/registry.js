let users = [];

let registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("submit", register);

function register(e) {
    
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let position = document.getElementById("position").value;
    let password = document.getElementById("password").value;
    let password_check = document.getElementById("password_check").value;
    let password_input = document.getElementById("password_check");

    e.preventDefault();

    if(password != password_check) {
        password_input.setCustomValidity("Las contraseñas no son iguales.");
        return;
    }

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    //Temporal id
    let str = JSON.stringify({
            "id": 3,
            "nombre": firstname,
            "apellido": lastname,
            "username": username,
            "email": email,
            "password": password,
            "ingreso": today,
            "puesto": position,
            "imagen": "",
            "actual": 0,
            "pending": 0,
            "assisted": 0
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/users/');
    xhr.setRequestHeader('content-type','application/json');
    xhr.send(str);
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido.");
        }else{
            alert(xhr.status+ ': '+ xhr.statusText + "/n Creado.");
            //location.reload();
        }
    }

}