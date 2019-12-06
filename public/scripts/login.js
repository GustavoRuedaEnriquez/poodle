function logIn(evt) {
    
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let str = JSON.stringify({
        'email' : email,
        'password':password
    });

    if(document.querySelectorAll("input:invalid").length == 0) {
        event.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open('POST','/api/login');

        xhr.setRequestHeader('content-type','application/json');
        
        xhr.onload = ()=>{
            if(xhr.status != 200){
                alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
            }else{
                let response = JSON.parse(xhr.responseText);
                sessionStorage.setItem("token",response.token);
                sessionStorage.setItem("user",JSON.stringify(response.User));
                location.href = "./calendar.html";
            }
        }
        xhr.send(str);
    }
}