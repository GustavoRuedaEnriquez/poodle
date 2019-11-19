let dates = []
let people = []
let usersnames = []
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
        'no_integrantes': people.length,
        'fecha': null,
        'importancia': importance,
        'organizador': 1,
        'horarios_propuestos': dates,
        'integrantes': people
    })

    let xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:3000/meetings')

    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 201){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            alert('Meeting Creada')
            location.reload()
        }
    }
}


function detailAllMeeting (userId) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings?organizador='+userId)

    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response)
            resultJson = JSON.parse(xhr.response)
            console.log(resultJson)
            let htmlMeetings = `<div style="padding: 30px;padding-top: 80px;" >
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre de Meeting</th>
                        <th scope="col">Fecha</th>
                        <th scope="col">Hora</th>
                        <th scope="col">Importancia</th>
                    </tr>
                </thead>
                <tbody>`
            resultJson.forEach(item=>{
                let auxDate = new Date(item.fecha)
                let dateDay = auxDate.getDate() + '/' + auxDate.getMonth() + '/' + auxDate.getFullYear()
                let dateTime = auxDate.getTime()
                htmlMeetings += `<tr onclick="clickRow(${item.id})">
                        <th scope="row">${item.id}</th>
                        <td>${item.nombre}Junta de Kali</td>
                        <td>${dateDay}</td>
                        <td>${dateTime}</td>
                        <td>${item.importancia}</td>
                    </tr>`
            })
            htmlMeetings += `</tbody>
                    </table>
                </div>`
            document.getElementById("beginMeetings").innerHTML = htmlMeetings
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
            let jsonResult = JSON.parse(xhr.response)
            let dateResult
            let timeResult
            if(jsonResult.fecha) {
                dateResult = jsonResult.fecha.split(' ')[0]
                timeResult = jsonResult.fecha.split(' ')[1]
            } else {
                dateResult = null
                timeResult = null
            }
            
            htmlResult = `<div class="form-group" style="margin-top: 20px">
                                    <label for="full_name_id" class="control-label">Nombre de Meeting</label>
                                    <div class="col-md-8">
                                        <label>${jsonResult.nombre}</label>
                                    </div>
                                </div>

                                <div class="row" style="margin-top: 20px">
                                    <div class="col-md-5 form-group ">
                                        <label for="full_name_id" class="control-label">Fecha de Meeting</label>
                                        <div class="col-md-10" style="padding:10px">
                                            <input id="datepicker" width="276" value="${dateResult}" disabled=true/>
                                        </div>
                                    </div>
                                    <div class="col-md-5 form-group">
                                        <label for="full_name_id" class="control-label">Horario de Meeting</label>
                                        <div class="col-md-10" style="padding:10px">
                                            <input id="timepicker" width="276" value="${timeResult}" disabled=true/>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-top: 10px">`
            jsonResult.horarios_propuestos.forEach(item =>{
                htmlResult += `<div class="col-md-8">
                    <i class="fas fa-calendar-day"></i>
                    <label>${item}</label>
                </div>`
            })
            htmlResult +=`      
                                </div>
                                <div class="form-group" style="margin-top: 20px">
                                    <label for="full_name_id" class="control-label">Importancia</label>
                                    <div class="col-md-8">
                                        <label>${jsonResult.importancia}</label>
                                    </div>
                                </div>
                                <div class="form-group" style="margin-top: 20px">
                                    <label for="full_name_id" class="control-label">Organizador</label>
                                    <div class="col-md-8">
                                        <label>${jsonResult.organizador}</label>
                                    </div>
                                </div>
                                <div class="form-group" style="margin-top: 20px">
                                    <label for="full_name_id" class="control-label">Participantes</label>
                                    <div style="margin-top: 10px">`
            jsonResult.integrantes.forEach(item => {
                htmlResult += `<div class="col-md-8">
                    <i class="fa fa-user bigicon"></i>
                    <label>${item}</label>
                </div>`
            })
            htmlResult +=`          </div>
                                </div>

                                <div class="form-group">
                                    <label for="full_name_id" class="control-label">Descripción</label>
                                    <div class="col-md-8">
                                        <p>
                                            ${jsonResult.descripcion}
                                        </p>
                                    </div>
                                </div>`
            document.getElementById("beginDetailMeetins").innerHTML = htmlResult
        }
    }
    console.log("jajaja")
}

function getMeetings () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response)
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
        'organizador': 1,
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
            console.log(xhr.response[0])
            return xhr.response[0].id
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
    let resultDate = new Date(date+ ' ' + time + ':00')
    dates.push(resultDate)
    let htmlDates = ''
    dates.forEach(item =>{
        htmlDates += `<div class="col-md-8">
            <i class="fas fa-calendar-day"></i>
            <label>${item}</label>
        </div>`
    })
    document.getElementById("beginDates").innerHTML = htmlDates
}


function addPerson () {
    let username = document.querySelector('#email').value
    let xhr = new XMLHttpRequest()

    xhr.open('GET','http://localhost:3000/users?username=' + username)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        } else {
            console.log(JSON.parse(xhr.response)[0])
            let personId = JSON.parse(xhr.response)[0].id
            usersnames.push(username)
            people.push(personId)
            let htmlUsers = ''
            usersnames.forEach(item => {
                htmlUsers += `<div class="col-md-8">
                    <i class="fa fa-user bigicon"></i>
                    <label>${item}</label>
                </div>`
            })
            document.getElementById("beginUsers").innerHTML = htmlUsers
        }
    }
}


