let dates = []
let people = []

function createMeeting () {
    let nombre = document.querySelector('#fname').value
    let description = document.querySelector('#description').value
    let importance = document.querySelector('#importance').value
    let id = getLastMeetingId() + 1 
    // already have dates
    // already have people
    // already have quantity of people

    let resultJson = {
        'id': id,
        'nombre': nombre,
        'descripcion': description,
        'no_integrantes': people.length,
        'fecha': null,
        'importancia': importance,
        'horarios_propuestos': dates,
        'integrantes': people,
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST','/api/meetings');

    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(resultJson);
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            alert('Meeting Creada')
            window.location.href = "/MyMeetings.html";
        }
    }
}


function detalleMeeting (id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET','/api/meetings/'+id);

    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(resultJson);
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            resultJson = xhr.response.body

            document.querySelector('#fname').value = resultJson.nombre
            document.querySelector('#description').value = resultJson.descripcion
            document.querySelector('#importance').value = resultJson.importancia
            fecha_decisiva = resultJson.fecha
            people = resultJson.integrantes
            dates = resultJson.horarios_propuestos
        }
    }
}

function getMeetingData (id) {
    xhr.open('GET','/api/meetings/'+id)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            console.log(xhr.response.body)
        }
    }
}

function editMeeting (id) {
    let nombre = document.querySelector('#fname').value
    let description = document.querySelector('#description').value
    let importance = document.querySelector('#importance').value
    // already have dates
    // already have people
    // already have quantity of people

    let resultJson = {
        'id': id,
        'nombre': nombre,
        'descripcion': description,
        'no_integrantes': people.length,
        'fecha': null,
        'importancia': importance,
        'horarios_propuestos': dates,
        'integrantes': people,
    }

    let xhr = new XMLHttpRequest();
    xhr.open('PUT','/api/meetings/' + id);

    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(resultJson);
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            alert('Meeting Modificada')
            window.location.href = "/calendario.html";
        }
    }
}

function getUserId (username) {
    xhr.open('GET','/api/users?username=' + username)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            return xhr.response.body.id
        }
    }
}

function getLastMeetingId () {
    xhr.open('GET','/api/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        }else{
            allMeetings = xhr.response.body
            return allMeetings[allMeetings.length-1].id
        }
    }
}

function addDate () {
    let date = document.querySelector('#datepicker').value
    let time = document.querySelector('#timepicker').value
    dates.push(getDateFromFormat(date + ' ' + time, "YYYY/MM/dd h:mm:ss a"))
}


