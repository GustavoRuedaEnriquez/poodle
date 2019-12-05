let dates = []
let people = []
let usersnames = []
let currentUser = JSON.parse(sessionStorage.getItem("user"))
let meeting
let finalDate = ""

function constructMeeting () {
    let nombre = document.querySelector('#nameMeetingInput').value
    let description = document.querySelector('#descriptionInput').value
    let importance = document.querySelector('#importanceInput').value
    //let id = getLastMeetingId() + 1 
    // already have dates
    // already have people
    // already have quantity of people
    
    let resultJson = JSON.stringify({
        // 'id': id,
        'name': nombre,
        'description': description,
        'participants_number': people.length,
        'date': finalDate,
        'importance': importance,
        'organizer': currentUser,
        'schedule_proposals': dates,
        'participants': people
    })
    return resultJson
}

function createMeeting (e) {
    console.log("foo")
    
    resultJson = constructMeeting()
    
    if (!(resultJson.name && resultJson.description && resultJson.importance)) {
        alert("Faltan datos")
        return
    }

    console.log(resultJson)
    
    if (!resultJson) return

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
            resultJson = JSON.parse(xhr.response).results
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
            let x = 0;
            resultJson.forEach(item => {
                let auxDate
                let dateDay = 'Sin Definir'
                let dateTime = 'Sin Definir'
                if (item.date) {
                    auxDate = new Date(item.date)
                    dateDay = auxDate.getDate() + '/' + auxDate.getMonth() + '/' + auxDate.getFullYear()
                    dateTime = auxDate.getHours() + ':' + auxDate.getMinutes()
                }
                htmlMeetings += `<tr>
                        <th onclick="clickRow('${item._id}')" scope="row">${x}</th>
                        <td onclick="clickRow('${item._id}')">${item.name}</td>
                        <td onclick="clickRow('${item._id}')">${dateDay}</td>
                        <td onclick="clickRow('${item._id}')">${dateTime}</td>
                        <td onclick="clickRow('${item._id}')">${item.importance}</td>
                        <td>`
                if (currentUser._id === item.organizer._id) {
                    htmlMeetings += `<i class="fas fa-edit" onclick="editRow('${item._id}')"></i>`
                }
                htmlMeetings += `</td></tr>`
                x++
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
            let jsonResult = JSON.parse(xhr.response).result
            console.log(jsonResult)
            let dateResult = ""
            let timeResult = ""
            if(jsonResult.date) {
                let auxDate = new Date(jsonResult.date)
                console.log(auxDate.toLocaleString())
                dateResult = auxDate.toLocaleString().split(' ')[0]
                timeResult = auxDate.toLocaleString().split(' ')[1]
            }
            document.getElementById("datepicker").value = dateResult
            document.getElementById("timepicker").value = timeResult
            if (type === 'detail') {
                document.getElementById("nameMeetingLabel").innerText = jsonResult.name
                document.getElementById("importanceLabel").innerText = jsonResult.importance
                document.getElementById("organizerLabel").innerText = jsonResult.organizer
                document.getElementById("descriptionParagraph").innerText = jsonResult.description
            } else {
                document.getElementById("nameMeetingInput").value = jsonResult.name
                document.getElementById("importanceInput").value = jsonResult.importance
                document.getElementById("descriptionInput").value = jsonResult.description
            }
            
            dates = jsonResult.schedule_proposals
            people = jsonResult.participants 

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
                <label>${item.username}</label>
            </div>`
        if (type === 'edit') {
            textHTML += `<div class="col-md-1">
                <i class="fas fa-minus-circle" onclick="removeParticipant('${item._id}')"></i>
            </div>`
        }
        textHTML += `</div>`
    })
    document.getElementById("participantsDiv").innerHTML = textHTML
}

function drawProposals (type) {
    textHTML = ''
    dates.forEach(item =>{
        console.log(item)
        textHTML += `<div class="row">
                    <div class="col-md-3">
                        <i class="fas fa-calendar-day"></i>
                        <label>${item.date.toLocaleString()}</label>
                    </div>`
        if (type === 'edit') {
            textHTML += `<div class="col-md-1">
                        <i class="fas fa-minus-circle" onclick="removeProposal('${item.date.toLocaleString()}')"></i>
                    </div>`
        } else if (type === 'detail') {
            textHTML += `<div class="col-md-1">
                            <input type="checkbox" name="${item._id}" value="${item._id}" onchange="checkboxEventHandler('${item}')">
                    </div>`
        }
        textHTML += `</div>`
    })
    document.getElementById("proposalsDivs").innerHTML = textHTML
}

function removeParticipant (itemToRemove) {
    people = people.filter(function (item) {
        return item._id !== itemToRemove;
    });
    drawParticipants('edit')
}

function removeProposal (itemToRemove) {
    dates = dates.filter(function (item) {
        return item.date.toLocaleString() !== itemToRemove;
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

function defineDate () {
    let date = document.querySelector('#datepicker').value
    let time = document.querySelector('#timepicker').value
    
    if (!(date && time)) return

    let resultDate = new Date(date + ' ' + time + ':00')
    
    finalDate = resultDate

    editMeeting()
}

function editMeeting () {
    resultJson = constructMeeting()

    let xhr = new XMLHttpRequest()
    xhr.open('PUT','http://localhost:3000/api/meeting/' + idMeeting)

    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            alert('Meeting Modificada')
            location.reload()
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
    drawProposals('edit')
    // let htmlDates = ''
    // dates.forEach(item =>{
    //     htmlDates += `<div class="col-md-8">
    //         <i class="fas fa-calendar-day"></i>
    //         <label>${item.date.toLocaleString()}</label>
    //     </div>`
    // })
    // document.getElementById("beginDates").innerHTML = htmlDates
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
                return item._id === personId
            })
            if (found) {
                alert("Este usuario ya se encuentra añadido")
                return
            }
            usersnames.push(username)
            people.push(auxResponse.result[0])
            drawParticipants('edit')
            // let htmlUsers = ''
            // usersnames.forEach(item => {
            //     htmlUsers += `<div class="col-md-8">
            //         <i class="fa fa-user bigicon"></i>
            //         <label>${item}</label>
            //     </div>`
            // })
            // document.getElementById("beginUsers").innerHTML = htmlUsers
        }
    }
}

function checkboxEventHandler(proposalVote) {
    inputChk = document.getElementById(proposalVote).checked
    //currentUser
    if (inputChk) {
        dates.forEach(item => {
            if (item._id === proposalVote) {
                item.voters = item.voters.find(function (item) {
                    item.votes++
                    return item._id === proposalVote
                });
            } 
            if (!found) {
                proposal.push(currentUser)
            }
        })
    } else {
        dates.forEach(item => {
            if (item._id === proposalVote) {
                item.voters = item.voters.filter(function (item) {
                    // checar si es el usuario o quien
                    item.votes--
                    return item._id !== currentUser._id;
                });
            }
        })
    }

}

function updateProposals () {

}
