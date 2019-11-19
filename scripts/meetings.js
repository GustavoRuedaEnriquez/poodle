let dates = []
let people = []
console.log("meetings.js load")

function createMeeting (e) {
    console.log("foo")
    let nombre = document.querySelector('#fname').value
    let description = document.querySelector('#description').value
    let importance = document.querySelector('#importance').value
    let id = getLastMeetingId() + 1 
    // already have dates
    // already have people
    // already have quantity of people

    let resultJson = JSON.stringify({
        'id': id,
        'nombre': nombre,
        'descripcion': description,
        'no_integrantes': people.lenght,
        'fecha': null,
        'importancia': importance,
        'horarios_propuestos': dates,
        'integrantes': people
    })
    console.log(resultJson)

    let xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:3000/meetings')

    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            alert('Meeting Creada')
            window.location.href = "/MyMeetings.html"
        }
    }
}


function detalleMeetingById (id) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings/'+id)

    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
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

function getMeetingDataById (id) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings/'+id)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response.body)
        }
    }
}

function getMeetings () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
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

    let xhr = new XMLHttpRequest()
    xhr.open('PUT','http://localhost:3000/meetings/' + id)

    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            alert('Meeting Modificada')
            window.location.href = "/calendario.html"
        }
    }
}

function getUserId (username) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/users?username=' + username)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            return xhr.response.body.id
        }
    }
}

function getLastMeetingId () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            allMeetings = xhr.response
            return allMeetings[allMeetings.length-1].id
        }
    }
}

function addDate () {
    let date = document.querySelector('#datepicker').value
    let time = document.querySelector('#timepicker').value
    dates.push(getDateFromFormat(date + ' ' + time, "YYYY/MM/dd h:mm:ss a"))
}


