var header = document.getElementsByTagName("header")[0];

butonIntroducere = document.getElementById("butonJos");

oraLaAdaugate = document.getElementById ("ora")
ziLaAdaugate = document.getElementById ("zi");
textLaAdaugate = document.getElementById ("text");

zilePtId = [ "monday", "tuesday", "wednesday", "thursday", "friday","saturday","sunday"]
var zileIdscript = {};
for(let i = 0; i < zilePtId.length; i++)
    zileIdscript[zilePtId[i]] = document.getElementById (zilePtId[i]);

//temp

function initial() {
    oraLaAdaugate.value = '';
    textLaAdaugate.value = '';
}

function insertFromDatabase(queryObj){
    //pus element gui pe site din db
    nrLinie++;

    var container = document.createElement("div");
    container.className = 'linieAct'
    container.id = 'div' + nrLinie;

    //console.log(queryObj);

    var linieOra = document.createElement("div");
    linieOra.className = 'ore';
    linieOra.innerHTML = queryObj.hour;

    var linieText = document.createElement("div");
    linieText.innerHTML = queryObj.text;
    
    var butonPtEditSiDelete = document.createElement("div");
    let editare = document.createElement('button')
    editare.addEventListener('click', function () {
            editFromDatabase(container.id, queryObj)
    });
    editare.innerHTML = '<i class="fas fa-arrow-alt-circle-down"></i>';

    deletare = document.createElement('button')
    deletare.addEventListener('click', function () {
            daDelete(queryObj._id)
     });
    deletare.innerHTML = '<i class="fas fa-dumpster"></i>';
    
    container.appendChild(linieOra);
    container.appendChild(linieText);
    butonPtEditSiDelete.appendChild(editare);
    butonPtEditSiDelete.appendChild(deletare);
    container.appendChild(butonPtEditSiDelete);
    //console.log(container);
    zileIdscript[queryObj.day].appendChild(container);
}

function inserarePeSiteDelete(queries){
    //sterg alea care se vad pe site
    for(let i = 0; i < zilePtId.length; i++)
        while(zileIdscript[zilePtId[i]].firstChild)
            zileIdscript[zilePtId[i]].removeChild(zileIdscript[zilePtId[i]].firstChild);
    
    for(let i = 0; i < queries.length; i++)
        insertFromDatabase(queries[i]);
}


function insert(){
    const postObject = {
        hour: oraLaAdaugate.value,
        day: ziLaAdaugate.value,
        text: textLaAdaugate.value
    }
    postSpreInserare(postObject);
}

function anuleazaEdit(id){
    
    var q = document.getElementById(id);
    q.removeChild(document.getElementById('container' + id));
}


function editFromDatabase( id, queryObj) {

    var divInputContainer = document.getElementById(id);

    var inputContainer = document.createElement("div");
    inputContainer.id = 'container' + id;
    inputContainer.className = 'edit';
    
    var scrisPtZi = document.createElement("select");
    scrisPtZi.className = 'editInput';
    scrisPtZi.innerHTML = '<option value="monday">Luni</option><option value="tuesday">Marti</option><option value="wednesday">Miercuri</option><option value="thursday">Joi</option><option value="friday">Vineri</option><option value="saturday">Sambata</option><option value="sunday">Duminica</option>';
    scrisPtZi.value = queryObj.day;
    scrisPtZi.id = 'day' + id;

    var scrisPtOra = document.createElement("input");
    scrisPtOra.className = 'editInput';
    scrisPtOra.type = "time"
    scrisPtOra.autocomplete = 'off'
    scrisPtOra.value = queryObj.hour;
    scrisPtOra.id = 'hour' + id;

    var scrisPtText = document.createElement("input");
    scrisPtText.className = 'editInput';
    scrisPtText.autocomplete = 'off'
    scrisPtText.value = queryObj.text;
    scrisPtText.id = 'text' + id;

    var confirm = document.createElement('button')
    confirm.addEventListener('click', function () {
            daEditare(id, queryObj) 
    });
    
    confirm.innerHTML = '<i class="fas fa-rocket"></i>';
    confirm.id = 'save' + id;

    var anuleaza = document.createElement('button')
    anuleaza.addEventListener('click', function () {
            anuleazaEdit(id) 
    });
    
    anuleaza.innerHTML = '<i class="fas fa-plane-slash"></i>';
    anuleaza.id = 'cancel' + id;

    inputContainer.appendChild(scrisPtZi)
    inputContainer.appendChild(scrisPtOra)
    inputContainer.appendChild(scrisPtText)
    inputContainer.appendChild(confirm)
    inputContainer.appendChild(anuleaza)

    divInputContainer.appendChild(inputContainer);
}


//partea de ajax

function catchAndInsDel(){

    fetch('/query')
    .then(function (response) {
        response.json().then(function (queries) {
            inserarePeSiteDelete(queries);
        });
    });//get
}

function postSpreInserare(postObject){

    fetch('/query', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        catchAndInsDel();
        initial();
    }).catch(function(err) {
        console.log('Fetch Error:-S', err);
    });
}

function daDelete(id) {

    fetch('/query', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: id
        })
      })
        .then(function() {
            catchAndInsDel();
    })

}

function daEditare(containerId, query){

    fetch('/query', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ID: query._id,
            hour: document.getElementById('hour' + containerId).value,
            day: document.getElementById('day' + containerId).value,
            text: document.getElementById('text' + containerId).value
        })
      })
        .then(res => {
            catchAndInsDel();
        })
}


//introducerea de nume

function exit(){
    localStorage.removeItem('name');
    document.getElementById("title").innerHTML = "Program";
    document.getElementById("title").style.color= "white";
    nameNotPut();
}

function titleChanger(){
    localStorage.name = document.getElementById("Name").value;
    document.getElementById("title").innerHTML = "Program pentru "+ localStorage.name ;
    document.getElementById("title").style.color= "white";
    nameIsPut();
//document.getElementById("Name").value
}
function nameIsPut(){
    // change if refresh+no name -> input
    header.innerHTML = "";
    var p = document.createElement("span")
    p.className = "NumeleTauAici";
    p.innerText = localStorage.name;
    p.style.color="white";
    p.style.fontSize="1.3em";
    var d = document.createElement("span")
    d.innerHTML = '<button type="button" id="exitButton" class="afara">Altcineva</button>'
    d.className = 'name'
    header.appendChild(p)
    header.appendChild(d)
    document.getElementById("exitButton").addEventListener('click', exit)

}

function nameNotPut() {

    header.innerHTML = "";
    var labelForName = document.createElement("div");
    labelForName.innerHTML = "<label class='name' > Numele tau aici </label>";
    labelForName.className = 'NumeleTauAici';
    labelForName.getElementsByTagName("LABEL")[0].style.color="white";
    labelForName.getElementsByTagName("LABEL")[0].style.fontSize="1.3em";
    let divPentruInputsiButon =  document.createElement("span");
    divPentruInputsiButon.className = "numeNou";

    var sendButton = document.createElement("span");
    sendButton.innerHTML = '<button type="button" id="nameButton"><i class="fas fa-user-circle"></i></button>'
    var inputName = document.createElement("span");
    inputName.innerHTML = '<input type="text" name="name" id="Name" autocomplete="off" class="inputNume"></input>';
    
    header.appendChild(labelForName)
    divPentruInputsiButon.appendChild(inputName)
    divPentruInputsiButon.appendChild(sendButton)
    header.appendChild(divPentruInputsiButon)
    sendButton.addEventListener('click', titleChanger);
}

if (localStorage.name)
{
    document.getElementById("title").innerText ="Program pentru "+ localStorage.name
    document.getElementById("title").style.color= "white";
    nameIsPut();
}
else 
{
    nameNotPut();
}

n =  new Date();
const zi = n.getDay();
const y = n.getFullYear();
const m = n.getMonth();
const d = n.getDate();
var nrLinie = 0;
zile = [ "Duminica" ,"Luni", "Marti", "Miercuri", "Joi", "Vineri","Sambata"]
luna = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"]
document.getElementById("time").innerHTML = zile[zi] + ", " + d + " " + luna[m] + " "+  y;

//pt adaugare in program
butonIntroducere.addEventListener('click', insert);

catchAndInsDel();