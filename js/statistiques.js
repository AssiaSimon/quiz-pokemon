const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");

let xmlhttp1 = new XMLHttpRequest();

let data;
let scoreDate = []; 
let setReponses = []; 
let setScores = []; 


function loadXMLDoc() {
    xmlhttp1.onreadystatechange = function () {
        if(xmlhttp1.readyState == 4 && xmlhttp1.status == 200){
            initSetScores(); 
            initScoreDate(); 
            fetchData();
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

function initScoreDate(){
    let dateIndex = 0; // index du tableau scoreDate

    // Vérifie si une donnée nommée "scores" existe dans le localStorage
    if (localStorage.getItem("dates") != null){
        // Récupère la chaîne de caractères stockée sous "dates"
        let dates = localStorage.getItem("dates");
        // Transforme la chaîne de caractères en tableau en découpant sur les virgules
        let myArr = dates.split(",");
        for (let i = 0; i < myArr.length; i++) {
            // rajoute la valeur de réponse dans le SET
            scoreDate[dateIndex] = myArr[i];
            dateIndex++; 
        } 
    } 
    
    console.log(scoreDate);
}


function drawHistogram(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let max_height = 400;
    let colonne_width = 30;

    // Dessiner l'histogram à partir des données dans le tableau tab
    let x = 20; 
    for(let i = 0; i< setScores.length; i++){
        let y = max_height - setScores[i]*35; // 10 points au maximum donc 350/10 = 35px par point
        let height = setScores[i]*35; 
        ctx.fillStyle = "#e8bd00ff";
        ctx.fillRect(x, y, colonne_width, height);

        // ajouter la date
        let y_txt = max_height + 15;

        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(scoreDate[i],x,y_txt);

        // ajoute le score 
        let y_score = max_height - setScores[i]*35 -10; 
        ctx.font = "15px Arial";
        ctx.fillText(setScores[i],x+10,y_score);

        x += colonne_width +40;
    }
}

function supprimerStats(){
    // Supprimer from localStorage la clé des Scores "scores" et des Dates "dates"
    localStorage.removeItem("scores");
    localStorage.removeItem("dates");

    // vider le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}