let xmlhttp = new XMLHttpRequest();

let nbPage = 0;
let pageSize = 10;      // nbQuestion / page
let startIndex = 0;
let endIndex = 0;
let page = 1;

let filtreData = [];   // Questions filtrées
let data = [];         // Toutes les questions
let currentData = [];   // Pour l'affichage (data ou filtreData)

function loadXMLDoc() {
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
            fetchData();
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
    currentData = data.slice(); // recopie toutes les questions
    displayData();
}

function displayData(){
    let i, idx; 
    let table = "<thead class='table-dark'><tr><th>#</th><th>Image</th><th>Thème</th><th>Question</th><th>Reponse 1</th><th>Reponse 2</th>" +
    "<th>Reponse 3</th><th>Reponse 4</th><th>Reponse Correcte</th><th>Point</th><th></th></tr></thead>";

    // Calcule de nbPage 
    let nb_elements = currentData.length; // nombre total d’éléments dans le XML
    nbPage = Math.ceil(nb_elements / pageSize); 
 
    /* Math.ceil = arrondit toujours à l’entier supérieur, car même si la dernière page n’est pas complète, il faut la compter */ 
 
    // Calcul des indices des éléments à afficher  
    startIndex = (page-1) * pageSize; // index du 1er élément de la page actuelle
    endIndex = startIndex + pageSize; // index juste après le dernier élément de la page
    
    // Si on dépasse le nombre d’éléments, s'arrête au dernier élément disponible 
    if(endIndex >= nb_elements){
        endIndex = nb_elements; 
    }
      
    // Mettre à jour la boucle en tenant compte de startIndex et endIndex
    for (i = startIndex; i < endIndex; i++) {  
        idx = i+1; // commence à 1

        table += "<tr><td>" +
        currentData[i].getElementsByTagName("id")[0].textContent +
        "</td>" +
        "<td><img src='" +  currentData[i].getElementsByTagName("image")[0].textContent +
        "' alt='image"+ idx +"' width='50px' height='50px'></img></td>" +
        "<td>" +
        currentData[i].getElementsByTagName("theme")[0].textContent +
        "</td><td>" +
        currentData[i].getElementsByTagName("contenu")[0].textContent +
        "</td><td>" +
        currentData[i].getElementsByTagName("response1")[0].textContent +
        "</td><td>" + 
        currentData[i].getElementsByTagName("response2")[0].textContent +
        "</td><td>" +
        currentData[i].getElementsByTagName("response3")[0].textContent +
        "</td><td>" +
        currentData[i].getElementsByTagName("response4")[0].textContent +
        "</td><td>" +
        currentData[i].getElementsByTagName("bonne_reponse")[0].textContent +
        "</td><td>" +     
        currentData[i].getElementsByTagName("point")[0].textContent +
        "</td><td>" + 
        "<a href='detail.html?id=" +
        currentData[i].getElementsByTagName("id")[0].textContent +
        "' class='a_details'><button type='button' class='btn btn-link'>Détails  <i class='bi bi-card-text'></i></button></a>" +
        "</td></tr>";
    }
    document.getElementById("data").innerHTML = table;
    showPageLinks(); 
}

/*** Filtrer par thème ***/

function filtrerData(){
    let i, idx; 
    let slThematique = document.getElementById("thematique");
    let theme = slThematique.options[slThematique.selectedIndex].value;
    alert(theme); 
 
    // Filtrer uniquement les questions du thème sélectionné
    filtreData = []; 
    for (i = 0; i < data.length; i++) {  
        let thematique = data[i].getElementsByTagName("theme")[0].textContent;
        if(theme == thematique || theme == "Tout"){
            filtreData.push(data[i]); 
        }
    }
    currentData = filtreData.slice(); // recopie toutes les questions filtrées
    page = 1; // revenir à la page 1
    displayData(); 
}

/***  Pagination ***/

function loadPage(pageNumber) {
    // Mettre à jour la valeur de page en fonction de pageNumber
    page = pageNumber;

    // Appeler la fonction displayData
    displayData();
}   

function showPageLinks() {
    let divpl = document.getElementById("pageLinks");

    let pageLinks ="";
    nbPage = Math.ceil(currentData.length/pageSize);
    console.log(currentData); 

    for(let i=1; i<= nbPage; i++){
        pageLinks += "<input type='button' onclick='loadPage("+ i 
        +")' value='" + i +
        "'></input>"; 
    }

    divpl.innerHTML =  pageLinks;
    divpl.style.display = "block";
}

/*** Tri par points ***/

function compareQuestionByPoint(a, b) {
    // a et b sont 2 questions 
    // convertit la chaine de caractères en entiers
    let pointA = parseInt(a.getElementsByTagName("point")[0].textContent); 
    let pointB = parseInt(b.getElementsByTagName("point")[0].textContent); 
    
    return pointA - pointB; // tri croissant 
    /* si la valeur retournée est negative a est avant b, 
    si la valeur est positive b avant a,
    simon la position ne change pas */
}

function sortData() {
    // afficher un message
    alert("Tri par ordre croissant des points"); 

    // tri le tableau 
    currentData.sort(compareQuestionByPoint); 
    page = 1; // revenir à la page 1
    displayData(); 
} 

/*** Recherhe par ID ou THEME ***/

function rechercheData(){
    // récupère valeur recherchée 
    let txtRecherche = document.getElementById("txtRecherche").value.trim(); 
    
    currentData = []; 
    for(let i = 0; i< data.length; i++){
        let id = data[i].getElementsByTagName("id")[0].textContent;
        let thematique = data[i].getElementsByTagName("theme")[0].textContent;
        if(id == txtRecherche || thematique == txtRecherche ){
            currentData.push(data[i]); 
        }    
    }
    page = 1; // revient à page 1
    displayData(); 
}

function retour_accueil(){
    //Obtenir l’URL actuelle de la page
    console.log(window.location.href);
    
    // Rediriger vers une autre page
    window.location.href = "index.html"
}

function viderTxtRecherche(){
    document.getElementById("txtRecherche").value = " "; 
} 