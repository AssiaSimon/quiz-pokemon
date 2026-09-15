let xmlhttp1 = new XMLHttpRequest();

let startIndexj = 0;
let endIndexj = 0;
let nbQuestion = 10; // nombre total de questions à récupérer
let questionSize = 1; // nbQuestion / page 
let question = 1; 
let currentTheme = ""; 
let data;
let lien; 
let lotQuestion = []; 

let listeQuestion = [];  // tableau pour stocker les questions de la thématique 
let scoreDate = []; 
let setReponses = []; 
let setScores = []; 
let currentScore = 0; 
let currentLot = 0; // 1er lot
let questionIndex = 0; 


function loadXMLDoc() {
    xmlhttp1.onreadystatechange = function () {
        if(xmlhttp1.readyState == 4 && xmlhttp1.status == 200){
            initSetAnswers();
            initSetScores(); 
            initScoreDate(); 
            fetchData();
            selectLots(); 
        }
    };
    xmlhttp1.open("GET", "https://obiwan.univ-brest.fr/~e21811674/data/bdd.xml", true);
    xmlhttp1.send();
}

function fetchData() {
    let i;
    let xmlDoc = xmlhttp1.responseXML;  // contient le document XML renvoyé par le serveur après la requête
    let x = xmlDoc.getElementsByTagName("question");

    data = [];
    for (i = 0; i < x.length; i++) {
        data.push(x[i]);   // .push ajouter un ou plusieurs éléments à la fin d’un tableau
    }

    console.log(data);   // affichage dans la console
}

function setTheme(element){
    // récupère theme du jeu 
    let themeJeu = element.textContent.trim();
    /* méthode .trim() supprime les espaces blancs / retours à la ligne au début + fin d’une chaîne de caractères */
    console.log("Theme cliqué :", themeJeu);

    // stocke la valeur du lien
    lien = "jeu.html?theme=" + themeJeu; 
    console.log(lien); 

    // redirige vers la page jeu 
   lienVersPageJeu(lien); 
}

function lienVersPageJeu(lien){
    //Obtenir l’URL actuelle de la page
    console.log(window.location.href);
    
    // Rediriger vers une autre page
    window.location.href = lien; 
}

function getTheme(){
    // récupère le theme choisi de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const themeRecupere = urlParams.get("theme");
    alert("Theme actuel : " + themeRecupere);
 
    if(themeRecupere != null){
        // stocke dans une variable globale
        currentTheme = themeRecupere; 

        // lance le jeu 
        start(); 
    }else{
        alert("Il faut choisir un thème pour lancer le quiz !"); 
        // redirige vers page accueil 
        retour_accueil(); 
    }
    viderSetAnswers();
    
}

function start(){
    let nbrQuestion = 0;
    let indChoisis = [];
    listeQuestion = [];  

    if(currentTheme != "Quiz Aléatoire" && currentTheme != "Lot de Questions"){
        // ajoute les questions du thème choisi dans listeQuestion 
        for(let i = 0; i < data.length; i++){
            let thematique = data[i].getElementsByTagName("theme")[0].textContent;
            if(thematique == currentTheme){
                listeQuestion.push(data[i]);  // ajouter à la fin d’un tableau
            } 
        }
    } else if(currentTheme == "Lot de Questions"){
        // récupère le lot actuel depuis localtorage
        getCurrentLot(); 

        // séléctionne le lot de questions actuel
        listeQuestion = lotQuestion[currentLot]; 

        setCurrentLot(); // passe au lot suivant et le sauvegarde

    } else {
        // ajoute les question dans listeQuestion de façon aléatoire
        for(let i = 0; i < data.length; i++){
            if (nbrQuestion < 10){
                // Génère un nombre entre 1 et 67
                let indAleatoire = Math.floor(Math.random() * data.length); 
                /* arondit les valeurs avec Math.floor pour avoir des entiers
                Math.random() * 67 -> génère un nombre aléatoire entre 0 (inclus) et 67 (exclus) */

                // vérifie si l'index est déjà choisi
                if(!indChoisis.includes(indAleatoire)){ 
                    // .includes = fonction qui vérifie qu'un élément existe dans le tableau array
                    
                    // ajoute l'id dans le tableau idChoisis
                    indChoisis.push(indAleatoire); 
                    // ajoute la question dans listeQuestion 
                    listeQuestion.push(data[indAleatoire]); 
                    nbrQuestion += 1;  
                } 
            }
        }
    }

    // affichage dans la console 
    console.log(listeQuestion);   
    // affiche les questions 
    displayQuestion(); 
}

function displayQuestion(){
    let idx = 0; 
    // ajuste la taille du conteneur
    document.getElementById("content").style.maxWidth = "900px";

    // ajoute zone question
    let contenuZone = "<h5>PokeQuiz<img src='img/pokeball_red.png' alt='game_img' height='70px' width='70px'>"
    + "</h5><hr></hr><div class='container-fluid'><div class='row'>";

    // Calcul des indices des éléments à afficher : 10 question par theme
    let startIndexj = (question-1) * questionSize;       // indice de départ de la question
    let endIndexj = startIndexj + questionSize;          // indice de fin (non inclus)

    for(let i = startIndexj; i < endIndexj; i++){
        idx = i+1; // commence à 1
        contenuZone += 
        "<div class='container-fluid'>" +
        "<div class='row' id='zoneQuestion' style='display:flex; align-items:center;'>" +
        "<img src='" + listeQuestion[i].getElementsByTagName('image')[0].textContent + 
        "' alt='image" + idx + 
        "' width='400px' height='500px' style='padding:20px;' />" +
        "<div style='display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: 20px;'>" +
            "<p id='questionPosition' style='padding: 10px;'><strong>QUESTION " + idx + "</strong> : " + 
                listeQuestion[i].getElementsByTagName('contenu')[0].textContent +
            "</p><br>" +
            "<div class='row'>" +
                "<div class='col-md-5 reponses'>" + 
                    "<input type='radio' name='rep' class='radio-reponse' onclick='setAnswer(event)' value='1' id='reponse1'>" +
                    /* Le name="rep" (ou name="reponse") -> regrouper plusieurs éléments de formulaire ensemble pour qu’ils soient considérés 
                    comme appartenant au même “groupe de réponse” pour radio */
                    
                    listeQuestion[i].getElementsByTagName('response1')[0].textContent + 
                "</div>" +
                "<div class='col-md-5 reponses'>" + 
                    "<input type='radio' name='rep' class='radio-reponse' onclick='setAnswer(event)' value='2' id='reponse2'>" +
                    /* le mot-clé "event" fait référence à l'événement déclenché, ici le clic */
                    listeQuestion[i].getElementsByTagName('response2')[0].textContent +
                "</div>" +
                "<div class='col-md-5 reponses'>" + 
                    "<input type='radio' name='rep' class='radio-reponse' onclick='setAnswer(event)' value='3' id='reponse3'>" +
                    listeQuestion[i].getElementsByTagName('response3')[0].textContent + 
                "</div>" +
                "<div class='col-md-5 reponses'>" + 
                    "<input type='radio' name='rep' class='radio-reponse' onclick='setAnswer(event)' value='4' id='reponse4'>" +
                    /* Dans un groupe de radio, seule une option peut être cochée à la fois 
                    -> le navigateur décoche automatiquement toutes les autres options du même groupe. */
                    listeQuestion[i].getElementsByTagName('response4')[0].textContent + 
                "</div>" +
            "</div>" +
            "</div>" +
        "</div>" +
        "</div>"; 
    } 

    contenuZone += "<div id='questionPage' style=''></div>";
    contenuZone += "</div></div>"; // fermeture du container principal
    document.getElementById("zoneJeu").innerHTML = contenuZone;
    showQuestionLinks();  
}

function loadQuestion(pageNumber) {
    // Mettre à jour la valeur de page en fonction de pageNumber
    question = pageNumber;

    // Appelle start 
    start();
}  


function showQuestionLinks() {
    // Ajouter les inputs pour afficher les pages de questions
    let divQuestion = document.getElementById("questionPage");

    let questionLinks = "<div class='d-grid gap-2 col-6 mx-auto'>" +
    "<button type='button' class='btn btn-warning' onclick='NextQuestionPage()'><i class='bi bi-check'></i> Valider</button>" +
    "</div>"; 
    divQuestion.innerHTML = questionLinks;
} 

function NextQuestionPage(){
    if(question+1 <= nbQuestion){
        // appelle fonction qui affiche la page de question 
        loadQuestion(question+1); 
        valider(); 
    } else if(question+1 > nbQuestion){
        // fin du quiz
        valider();
        getScore();
    }

}

function valider(){
    questionIndex = question - 2; 

    let userReponse = setReponses[questionIndex].trim();
    let correctReponse = listeQuestion[questionIndex].getElementsByTagName("bonne_reponse")[0].textContent.trim();  

    console.log("Réponse de l'utilisateur : ", userReponse);
    console.log("Bonne réponse : ", correctReponse);

    if(userReponse === correctReponse){
        alert("Réponse correcte !"); 
    }else{
        alert("Mauvaise réponse !"); 
    }
}

// ETAPE 1 : sauvegarder les réponses choisies dans le localStorage

function setAnswer(ev){
    questionIndex = question - 1; // index de la question actuelle
    
    // Vérifie si l'input radio vient d’être cochée
    if (ev.currentTarget.checked) {
        // Affiche dans la console la valeur de la radio cochée
        console.log("Checked - answer : " + ev.currentTarget.value); 
        // Ajoute la valeur de la radio cochée dans le tableau setReponses
        setReponses[questionIndex] = ev.currentTarget.value; // stocke la réponse 
    }
    console.log(setReponses);
    // Convertir le contenu du tableau en chaîne de caractères
    let fchaine = setReponses.join(","); 
    // Ajouter ou modifier le chaîne dans le localStorage, avec la clé est answers
    localStorage.setItem("answers", fchaine);
}

// ETAPE 2 : Récupérer les données enregistrées 

function initSetAnswers(){
    // Vérifie si une donnée nommée "answers" existe dans le localStorage
    if (localStorage.getItem("answers") != null){
        // Récupère la chaîne de caractères stockée sous "answers"
        let answers = localStorage.getItem("answers");
        // Transforme la chaîne de caractères en tableau en découpant sur les virgules
        let myArr = answers.split(",");
        for (let i = 0; i < myArr.length; i++) {
            // rajoute la valeur de réponse dans le tableau
            setReponses[i] = myArr[i];
        } 
    } 
    
    console.log(setReponses);
}

// ETAPE 3 : sauvegarder les scores dans le localStorage

function getScore(){
    let score = 0; // compteur des bonnes réponses 
    let totalPoints = 0; // compteur des points au total 

    // Vérifie si une donnée nommée "answers" existe dans le localStorage
    if (localStorage.getItem("answers") != null){
        // Récupère la chaîne de caractères stockée sous "answers"
        let answers = localStorage.getItem("answers");
        // Transforme la chaîne de caractères en tableau en découpant sur les virgules
        let myArr = answers.split(",");
        for (let i = 0; i < myArr.length; i++) {
        totalPoints += Number(listeQuestion[i].getElementsByTagName("point")[0].textContent); 
            // Si la reponse choisie est correcte on incremente le compteur
            if(myArr[i] == listeQuestion[i].getElementsByTagName("bonne_reponse")[0].textContent){
                score += Number(listeQuestion[i].getElementsByTagName("point")[0].textContent); 
            }
        } 

        // calcule un score sur 10 | Math.round arrondit vers le plus proche (le bas .floor ou le haut .ceil)
        let noteSur10 = Math.round((score / totalPoints) * 10); 
        
        // rajoute le score dans le tableau
        setScores.push(noteSur10);

        // le stocke dans une variable globale 
        currentScore = noteSur10; 

        // Convertir le contenu du tableau en chaîne de caractères
        let fchaine = Array.from(setScores).join(','); 
        // Ajouter ou modifier le chaîne dans le localStorage, avec la clé est "scores"
        localStorage.setItem("scores",fchaine); 
    } 
    
    console.log(setScores);
    displayScore();
}

// ETAPE 4 : Récupérer et afficher les scores enregistrés 

function initSetScores(){
    let scoreIndex = 0; // index du tableau setScores

    // Vérifie si une donnée nommée "scores" existe dans le localStorage
    if (localStorage.getItem("scores") != null){
        // Récupère la chaîne de caractères stockée sous "scores"
        let scores = localStorage.getItem("scores");
        // Transforme la chaîne de caractères en tableau en découpant sur les virgules
        let myArr = scores.split(",");
        for (let i = 0; i < myArr.length; i++) {
            // rajoute la valeur de réponse dans le tableau
            setScores[scoreIndex] = myArr[i];
            scoreIndex++; 
        } 
    } 
    
    console.log(setScores);
}

function displayScore(){
    lien = "jeu.html?theme=" + currentTheme; 
    let contenuZone = "<div class='container d-flex' style=' flex-direction: column; align-items: center; text-align: center;'>" +
    // d-flex → rend un element un conteneur flex (comme flexbox)
    "<img src='img/game_over.gif' alt='Game Over' width='400px' height='300px'>" + 
    "<br><br>" +
    "<h1>SCORE : <small>" + currentScore + "</small></h1> " +
    "<br><br><br>" +
    "<button type='button' class='btn btn-warning btn-lg' onclick='lienVersPageJeu(\"" + lien + "\")' style='box-shadow: 2px 2px 5px #e0e0e0; margin-top: 10px;'>" +         
        "<strong>PLAY AGAIN</strong>" +
        "<img src='img/replay.png' alt='replay' height='60px' width='60px' style='margin-left: 10px;'>" +
    "</button>" +
    "</div>"; 
    document.getElementById("zoneJeu").innerHTML = contenuZone;

    // appelle getDate(). pour stocker la date de l'obtention du score
    GetDate();
}

// ETAPE 5 : Récupérer la date de l'obtention du score et le sauvegarde

function GetDate(){
    let now = new Date();
    console.log(now); // affiche la date/heure actuelle
    let jour = now.getDate(); // récupère le jour du mois
    let mois = now.getMonth(); // récupère le mois 
    let annee = now.getFullYear(); // récupère l'année

    let date = jour + "/" + mois + "/" + annee; 

    scoreDate.push(date); // ajoute au tableau des dates 

    // Convertir le contenu du tableau en chaîne de caractères
    let fchaine = scoreDate.join(","); 
    // Ajouter ou modifier le chaîne dans le localStorage, avec la clé est "dates"
    localStorage.setItem("dates", fchaine);
}

function initScoreDate(){
    let dateIndex = 0; // index du tableau scoreDate

    // Vérifie si une donnée nommée "scores" existe dans le localStorage
    if (localStorage.getItem("dates") != null){
        // Récupère la chaîne de caractères stockée sous "dates"
        let dates = localStorage.getItem("dates");
        // Transforme la chaîne de caractères en tableau en découpant sur les virgules
        let myArr = dates.split(",");
        for (let i = 0; i < myArr.length; i++) {
            // rajoute la valeur de réponse dans le tableau
            scoreDate[dateIndex] = myArr[i];
            dateIndex++; 
        } 
    } 
    
    console.log(scoreDate);
}

function viderSetAnswers(){
    // supprimer from localStorage la clé des "answers"
    localStorage.removeItem("answers");
}

function selectLots(){
    // vider le tableau des lots
    lotQuestion = []; 
    let lot = []; 

    // créer les lots de questions, 10 questions par lot 
    for(let i = 0; i < data.length; i++){
       lot.push(data[i]); 
       if(lot.length == 10){
            lotQuestion.push(lot); 
            lot = []; // réinitialise le lot pour le suivant
       }
    } 
    console.log("Lots de questions : ", lotQuestion); 
}

function setCurrentLot(){   
    currentLot += 1;
    // si on dépasse le dernier lot -> retour au début 
    if (currentLot >= lotQuestion.length){
        currentLot = 0; 
    }
    
    // Sauvegarder
    localStorage.setItem("currentLot", currentLot);
    console.log("currentLot = ", currentLot); 
}

function getCurrentLot(){
    let lotEnregistre = localStorage.getItem("currentLot"); 
    if(lotEnregistre != null){
        currentLot = parseInt(lotEnregistre); 
    } else {
        currentLot = 0; // par défaut 
    }
    console.log("Lot récupéré de localStorage : ", currentLot); 
}

function retour_accueil(){
    //Obtenir l’URL actuelle de la page
    console.log(window.location.href);
    
    // Rediriger vers une autre page
    window.location.href = "index.html"
}