let dates = []
let people = []
let usersnames = []

function createMeeting (e) {
    console.log("foo")
    let nombre = document.querySelector('#fname').value
    let description = document.querySelector('#description').value
    let importance = document.querySelector('#importance').value
    //let id = getLastMeetingId() + 1 
    // already have dates
    // already have people
    // already have quantity of people

    if (!(nombre && description && importance)) {
        alert("Faltan datos")
        return
    }

    let resultJson = JSON.stringify({
        // 'id': id,
        'name': nombre,
        'description': description,
        'participants_number': people.length,
        'date': "",
        'importance': importance,
        'organizer': 1,
        'schedule_proposals': dates,
        'participants': people
    })

    let xhr = new XMLHttpRequest()
    xhr.open('POST','http://localhost:3000/api/meeting')

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
    //xhr.open('GET','http://localhost:3000/api/meetings?organizador='+userId)
    xhr.open('GET','http://localhost:3000/api/meetings')
    xhr.send()
    
    xhr.onload = function(){
        console.log(xhr.response.result)
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response.result)
            resultJson = JSON.parse(xhr.response.result)
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>`
            resultJson.forEach(item=>{
                let auxDate = new Date(item.fecha)
                let dateDay = auxDate.getDate() + '/' + auxDate.getMonth() + '/' + auxDate.getFullYear()
                let dateTime = auxDate.getTime()
                htmlMeetings += `<tr>
                        <th onclick="clickRow(${item._id})" scope="row">${item._id}</th>
                        <td onclick="clickRow(${item._id})">${item.nombre}</td>
                        <td onclick="clickRow(${item._id})">${dateDay}</td>
                        <td onclick="clickRow(${item._id})">${dateTime}</td>
                        <td onclick="clickRow(${item._id})">${item.importancia}</td>
                        <td><i class="fas fa-edit" onclick="editRow(${item._id})"></i></td>
                    </tr>`
            })
            htmlMeetings += `</tbody>
                    </table>
                </div>`
            document.getElementById("beginMeetings").innerHTML = htmlMeetings
        }
    }
}

function getMeetingDataById (id, type) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/api/meeting/'+id)
    xhr.send()
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            let jsonResult = JSON.parse(xhr.response.result)
            let dateResult
            let timeResult
            if(jsonResult.fecha) {
                dateResult = jsonResult.fecha.split(' ')[0]
                timeResult = jsonResult.fecha.split(' ')[1]
            } else {
                dateResult = ""
                timeResult = ""
            }
            document.getElementById("datepicker").value = dateResult
            document.getElementById("timepicker").value = timeResult
            if (type === 'detail') {
                document.getElementById("nameMeetingLabel").innerText = jsonResult.nombre
                document.getElementById("importanceLabel").innerText = jsonResult.importancia
                document.getElementById("organizerLabel").innerText = jsonResult.organizador
                document.getElementById("descriptionParagraph").innerText = jsonResult.descripcion
            } else {
                document.getElementById("nameMeetingInput").value = jsonResult.nombre
                document.getElementById("importanceInput").value = jsonResult.importancia
                document.getElementById("descriptionInput").value = jsonResult.descripcion
            }
            
            dates = jsonResult.horarios_propuestos
            people = jsonResult.integrantes 

            drawParticipants(type)
            drawProposals(type)
        }
    }
}

function drawParticipants (type) {
    textHTML = ''
    people.forEach(item => {
        textHTML += `<div class="row">
            <div class="col-md-3">
                <i class="fa fa-user bigicon"></i>
                <label>${item}</label>
            </div>`
        if (type === 'edit') {
            textHTML += `<div class="col-md-1">
                <i class="fas fa-minus-circle" onclick="removeParticipant(${item})"></i>
            </div>`
        }
        textHTML += `</div>`
        document.getElementById("participantsDiv").innerHTML = textHTML
    })
}

function drawProposals (type) {
    textHTML = ""
    dates.forEach(item =>{
        console.log(item)
        textHTML += `<div class="row">
                    <div class="col-md-3">
                        <i class="fas fa-calendar-day"></i>
                        <label>${item.date}</label>
                    </div>`
        if (type === 'edit') {
            textHTML += `<div class="col-md-1">
                        <i class="fas fa-minus-circle" onclick="removeProposal('${item.date}')"></i>
                    </div>`
        } else if (type === 'detail') {
            textHTML += `<div class="col-md-1">
                            <input type="checkbox" name="${item._id}" value="${item._id}" onchange="checkboxEventHandler('${item}')">
                    </div>`
        }
        textHTML += `</div>`
        document.getElementById("proposalsDivs").innerHTML = textHTML
    })
}

function removeParticipant (itemToRemove) {
    people = people.filter(function (item) {
        console.log(item !== itemToRemove)
        return item !== itemToRemove;
    });
    drawParticipants('edit')
}

function removeProposal (itemToRemove) {
    dates = dates.filter(function (item) {
        return item._id !== itemToRemove;
    });
    drawProposals('edit')
}

function getMeetings () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/api/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response.result)
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

    // get Id of current user
    let resultJson = {
        'name': nombre,
        'description': description,
        'participants_number': people.length,
        'organizer': 1,
        'date': null,
        'importance': importance,
        'schedule_proposals': dates,
        'participants': people,
    }

    let xhr = new XMLHttpRequest()
    xhr.open('PUT','http://localhost:3000/api/meetings/' + id)

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
    xhr.open('GET','http://localhost:3000/api/users?username=' + username)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            console.log(xhr.response.result[0])
            return xhr.response.result[0]._id
        }
    }
}

function getLastMeetingId () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','http://localhost:3000/api/meetings')
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            allMeetings = xhr.response.result
            return allMeetings[allMeetings.length-1]._id
        }
    }
}

function addDate () {
    let date = document.querySelector('#datepicker').value
    let time = document.querySelector('#timepicker').value
    let resultDate = new Date(date+ ' ' + time + ':00')

    let found = dates.find( function (item) {
        return item.date.toString() === resultDate.toString()
    })
    if (found) {
        alert("Esta fecha ya se encuentra añadida")
        return
    }

    let auxProposal = {
        date: resultDate,
        votes: 0,
        voters: []
    }
    dates.push(auxProposal)
    let htmlDates = ''
    dates.forEach(item =>{
        htmlDates += `<div class="col-md-8">
            <i class="fas fa-calendar-day"></i>
            <label>${item.date.toLocaleString()}</label>
        </div>`
    })
    document.getElementById("beginDates").innerHTML = htmlDates
}


function addPerson () {
    let username = document.querySelector('#email').value
    let xhr = new XMLHttpRequest()

    xhr.open('GET','http://localhost:3000/api/user/username/' + username)
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        } else {
            let auxResponse = JSON.parse(xhr.response) 
            console.log(xhr.response)
            let personId = auxResponse.result[0]._id
            let found = people.find( function (item) {
                return item === personId
            })
            if (found) {
                alert("Este usuario ya se encuentra añadido")
                return
            }
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

function checkboxEventHandler(proposalVote) {
    inputChk = document.getElementById(proposalVote).checked
    userId = 1 //checar el id del user
    if (inputChk) {
        dates.forEach(item => {
            if (item._id === proposalVote) {
                item.voters = item.voters.find(function (item) {
                    return item._id === proposalVote
                });
            } 
            if (!found) {
                proposal.push(userId)
            }
        })
    } else {
        dates.forEach(item => {
            if (item._id === proposalVote) {
                item.voters = item.voters.filter(function (item) {
                    // checar si es el usuario o quien
                    return item._id !== userId;
                });
            }
        })
    }
}

function updateProposals () {

}
