let dates = []
let people = []
let usersnames = []
let currentUser = JSON.parse(sessionStorage.getItem("user"))
people.push(currentUser)
let meeting
let meetings = []
let finalDate = ""
let totalPagesLen = 3

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
    
    resultJson = constructMeeting()
    
    if (!resultJson) return

    let xhr = new XMLHttpRequest()
    xhr.open('POST','/api/meeting')
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
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


function detailAllMeeting (page, limit) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET',`/api/meetings/user/${currentUser.email}?page=${page}&limit=${limit}`)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            totalPagesLen = JSON.parse(xhr.response).lengthRes
            meetings = JSON.parse(xhr.response).results
            meetings.map(item => {
                let auxDate
                let dateDay = 'Sin Definir'
                let dateTime = 'Sin Definir'
                if (item.date) {
                    auxDate = new Date(item.date)
                    let auxDay = auxDate.getDate() < 10 ? '0' : ''
                    let auxMonth = auxDate.getMonth() < 9 ? '0' : ''
                    let auxHour = auxDate.getHours() < 10 ? '0' : ''
                    let auxMin = auxDate.getMinutes() < 10 ? '0' : ''
                    dateDay = auxDay + auxDate.getDate() + '/' + auxMonth + (auxDate.getMonth() + 1) + '/' + auxDate.getFullYear()
                    dateTime = auxHour + auxDate.getHours() + ':' + auxMin + auxDate.getMinutes()
                }
                item.dateString = dateDay
                item.timeString = dateTime
                return item
            })
            drawDetailTable(meetings)
            makePagination()
        }
    }
}

function makePagination () {
    pages = Math.floor((totalPagesLen + 5 - 1) / 5)
    $('#pagination-demo').twbsPagination({
        totalPages: pages,
        // the current page that show on start
        startPage: 1,

        // maximum visible pages
        visiblePages: 5,

        initiateStartPageClick: true,

        // template for pagination links
        href: false,

        // variable name in href template for page number
        hrefVariable: '{{number}}',

        // Text labels
        first: 'First',
        prev: 'Previous',
        next: 'Next',
        last: 'Last',

        // carousel-style pagination
        loop: false,

        // callback function
        onPageClick: function (event, page) {
            // details
            detailAllMeeting(page, 5)
            $('.page-active').removeClass('page-active');
        $('#page'+page).addClass('page-active');
        },

        // pagination Classes
        paginationClass: 'pagination',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first',
        pageClass: 'page',
        activeClass: 'active',
        disabledClass: 'disabled'
    });
}

function drawDetailTable (filterMeetings) {
    let htmlMeetings = `<div>
    <table class="table table-striped table-hover">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre de Meeting</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Importancia</th>
                <th scope="col">Organizador</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`
    let x = 0;
    filterMeetings.forEach(item => {
        htmlMeetings += `<tr>
                <th onclick="clickRow('${item._id}')" scope="row">${x}</th>
                <td onclick="clickRow('${item._id}')">${item.name}</td>
                <td onclick="clickRow('${item._id}')">${item.dateString}</td>
                <td onclick="clickRow('${item._id}')">${item.timeString}`
        auxRepeats = filterMeetings.filter(function (repeat) {
            return item.dateString === repeat.dateString && item.timeString === repeat.timeString && item.dateString !== 'Sin Definir'
        })
        if (auxRepeats.length > 1) {
            htmlMeetings += `<i class="fas fa-exclamation-triangle" style="color:orange"></i>`
        }
        htmlMeetings += `</td>
                <td onclick="clickRow('${item._id}')">${item.importance}</td>
                <td onclick="clickRow('${item._id}')">${item.organizer.username}</td>
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

function getMeetingDataById (id, type) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','/api/meeting/'+id)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
    xhr.send()
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            let jsonResult = JSON.parse(xhr.response).result
            let dateResult = ""
            let timeResult = ""
            if(jsonResult.date) {
                jsonResult.date = new Date(jsonResult.date)
                dateResult = jsonResult.date.toLocaleString().split(' ')[0]
                dateResult = ((jsonResult.date.getMonth()+1) + '/' + jsonResult.date.getDate() + '/' + jsonResult.date.getFullYear())
                timeResult = jsonResult.date.toLocaleString().split(' ')[1]
            }
            document.getElementById("datepicker").value = dateResult
            document.getElementById("timepicker").value = timeResult
            if (type === 'detail') {
                document.getElementById("nameMeetingLabel").innerText = jsonResult.name
                document.getElementById("importanceLabel").innerText = jsonResult.importance
                document.getElementById("organizerLabel").innerText = jsonResult.organizer.username
                document.getElementById("descriptionParagraph").innerText = jsonResult.description
            } else {
                document.getElementById("nameMeetingInput").value = jsonResult.name
                document.getElementById("importanceInput").value = jsonResult.importance
                document.getElementById("descriptionInput").value = jsonResult.description
            }
            jsonResult.schedule_proposals.map(item => {
                item.date = new Date(item.date)
                return item
            })
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
        if (type === 'edit' && item.username !== currentUser.username) {
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
                            <input type="checkbox" name="${item.date}" value="${item.date}" id="${item.date}" onchange="checkboxEventHandler('${item.date}')" `
            let found = item.voters.find(function (itemVoter) {
                return itemVoter._id === currentUser._id
            })
            if (found) {
                textHTML += `checked` 
            }
            textHTML += `>
                    </div>
                    `
        }
        textHTML += `<div class="col-md-2">Total de Votos: <b>${item.votes}</b></div>`
        // textHTML += `<div class="col-md-1 btn-group">
        // <button type="button" class="btn btn-xs dropdown-toggle" style="width: fit-content;height: fit-content;padding:0px"
        //         data-toggle="dropdown">
        //   <span class="caret"></span>
        // </button>
      
        // <ul class="dropdown-menu" role="menu">`
        
        // item.voters.forEach(itemVoter => {
        //     textHTML +=`<li>${itemVoter.username}</li>`
        // })
        // textHTML += `</ul>
        //   </div>`
        textHTML += ` </div>`
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
    xhr.open('GET','/api/meetings')
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
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
    xhr.open('PUT','/api/meeting/' + idMeeting)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
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
    xhr.open('GET','/api/users?username=' + username)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
            return xhr.response.result[0]._id
        }
    }
}

function getLastMeetingId () {
    let xhr = new XMLHttpRequest()
    xhr.open('GET','/api/meetings')
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
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

    xhr.open('GET','/api/user/username/' + username)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
    xhr.send()
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        } else {
            let auxResponse = JSON.parse(xhr.response) 
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
    proposalVote = new Date(proposalVote)
    //currentUser
    console.log(inputChk)
    if (inputChk) {
        dates.forEach(item => {
            if (item.date.toLocaleString() === proposalVote.toLocaleString()) {
                let found = item.voters.find(function (item) {
                    return item._id === currentUser._id
                })
                if (!found) {
                    item.voters.push(currentUser)
                    item.votes = item.voters.length
                }
            } 
        })
    } else {
        dates.forEach(item => {
            if (item.date.toLocaleString() === proposalVote.toLocaleString()) {
                item.voters = item.voters.filter(function (itemVoters) {
                    // checar si es el usuario o quien
                    if (itemVoters._id !== currentUser._id) {
                        return true
                    } 
                    return false
                });
                item.votes = item.voters.length
            }
        })
    }
    updateProposals()
    drawProposals('detail')
    console.log(dates)
}

function updateProposals () {
    console.log('foo')
    let resultJson = JSON.stringify({
        'schedule_proposals': dates
    })

    let xhr = new XMLHttpRequest()
    xhr.open('PATCH','/api/meeting/' + idMeeting)
    xhr.setRequestHeader('Authorization',sessionStorage.getItem("token"))
    xhr.setRequestHeader('Content-type','application/json')
    xhr.send(resultJson)
    
    xhr.onload = function(){
        if(xhr.status != 200){
            alert(xhr.status+ ': '+ xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.")
        }else{
        }
    }
}
