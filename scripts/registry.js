let users = [];

let registerBtn = document.getElementById("registerBtn");
registerBtn.addEventListener("click", register);

function register(event) {
    
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let position = document.getElementById("position").value;
    let password = document.getElementById("password").value;
    let password_check = document.getElementById("password_check").value;
    let password_input = document.getElementById("password_check");

    if(password != password_check) {
        password_input.setCustomValidity("Las contraseñas no son iguales.");
        return;
    }
    
    event.preventDefault();

    let str = JSON.stringify({
            "nombre": firstname,
            "apellido": lastname,
            "username": username,
            "email": email,
            "password": password,
            "position": position,
            "image" : "https://www.wataniya.com.sa/wp-content/uploads/2017/01/empty_person.jpg",
            "actual": 0,
            "pending": 0,
            "assisted": 0
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3000/api/user');
    xhr.setRequestHeader('content-type','application/json');
    xhr.send(str);
    xhr.onload = function(){
        if(xhr.status != 201){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido.");
        }else{
            alert(xhr.status+ ': '+ xhr.statusText + "/n Creado.");
            location.href = 'login.html';
        }
    }

}