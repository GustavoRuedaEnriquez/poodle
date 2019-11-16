function logIn() {

    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let str = JSON.stringify({
        'email' : email,
        'password':password
    });

    let xhr = new XMLHttpRequest();
    xhr.open('POST','server_url/login');

    xhr.setRequestHeader('content-type','application/json');
    xhr.send(str);
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
           window.location.href = "/calendario.html";
        }
    }
}