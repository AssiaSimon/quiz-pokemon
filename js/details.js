let xmlhttp = new XMLHttpRequest();

function loadXMLDoc() {
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            fetchData();
            displayQuestionById();
        }
    };
    xmlhttp.open("GET", "https://obiwan.univ-brest.fr/~e21811674/data/bdd.xml", true);
    xmlhttp.send();
}


function fetchData() {
    let i;
    let xmlDoc = xmlhttp.responseXML;  // contient le document XML renvoyé par le serveur après la requête
    let x = xmlDoc.getElementsByTagName("question");

    data = [];
    for (i = 0; i < x.length; i++) {
        data.push(x[i]);   // .push ajouter un ou plusieurs éléments à la fin d’un tableau
    }

    console.log(data);   // affichage dans la console
    displayQuestionById(); 
}


function displayQuestionById() {   

    /* Récupérer questionid dans la chaîne de requête  */

    let urlParams = new URLSearchParams(window.location.search);
    // window.location.search : récupère la partie de l’URL après le ?
    // new URLSearchParams(...) : transforme cette chaîne en objet pratique pour récupérer les paramètres.
    let questionid = urlParams.get('id');   
    // récupère la valeur du paramètre id

    let i;         
    // récupère les éléments HTML correspondants à chaque champ
    let pkType = document.getElementById("pkType");
    let pkQuestion = document.getElementById("pkQuestion");
    let pkPoint = document.getElementById("pkPoint");
    let pkReponse = document.getElementById("pkReponse");
    let pkExplication = document.getElementById("pkExplication");
    let pkImage = document.getElementById("pkImage");

    // Parcourir les données XML
    for (i = 0; i < data.length; i++) {       
        // Vérifier si l’ID correspond 
        if (data[i].getElementsByTagName("id")[0].childNodes[0].nodeValue == questionid){
            // Afficher les informations de la question en utilisant les textboxes
            pkType.value = data[i].getElementsByTagName("theme")[0].textContent; 
            pkQuestion.value = data[i].getElementsByTagName("contenu")[0].textContent; 
            pkPoint.value = data[i].getElementsByTagName("point")[0].textContent;
            pkReponse.value = data[i].getElementsByTagName("bonne_reponse")[0].textContent;
            pkImage.src = data[i].getElementsByTagName("image")[0].textContent;
            pkExplication.innerHTML = data[i].getElementsByTagName("explication")[0].innerHTML;
            // .innerHTML pour récupérer le HTML du XML -> garder le formatage HTML, par exemple les <strong> ou <br> />
        }   
    }
} 
