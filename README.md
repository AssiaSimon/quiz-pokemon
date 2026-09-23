# Projet: 

Developper un jeu en ligne sur la thématique de Pokémon avec 3 interfaces obligatoires: interface jeu, interface apprendre, interface statistiques.



# Attributs d’une question (BDD): 

- id : identifiant unique de la question
- image : nom du fichier image associé à la question
- contenu : texte de la question à poser
- response1, response2, response3, response4 : propositions de réponses possibles
- bonne_reponse : numéro de la réponse correcte (1 à 4)
- point : nombre de points attribués pour une bonne réponse
- theme : catégorie ou type de la question
- explication : explication ou justification de la bonne réponse


# Arborescence du projet: 

	quiz-pokemon/
	|___ index.html
	|___ jeu.html
	|___ apprendre.html
	|___ statistiques.html
	|___ a_propos.html
	|___ detail.html
	|___ README.txt
	|___ css /
	|   |___ style.css
	|___ js /
	|   |___ scripts.js
	|	|___ jeu.js
	|   |___ details.js
	|   |___ statistiques.js
	|___ data /
	|   |___ bdd.xml
	|___ img /
	|   |___ images du projet


# BDD – Récupération et affichage: loadXMLDoc() et fetchData()

## Objectif: 
Afficher les données XML dans un tableau HTML en utilisant des fonctions JavaScript : loadXMLDoc() et fetchData().

On instancie une nouvelle requête XMLHttpRequest : let xmlhttp = new XMLHttpRequest();

## La fonction loadXMLDoc() permet de charger un fichier XML depuis un serveur distant et à traiter ses données une fois la réponse reçue.

1. Déclenche une requête HTTP pour récupérer un fichier XML depuis une URL avec la méthode "open()" qui initialise la requête avec la méthode 'GET' et la méthode "send()" envoie la requête au serveur: 
	- xmlhttp.open("GET", "https://obiwan.univ-brest.fr/~e21811674/data/bdd.xml", true);
	- xmlhttp.send();
2. Surveille l'état de la requête grâce à la propriété "onreadystatechange" de l'objet XMLHttpRequest qui sert à attribuer à une fonction callback (ici fetchData()) qui sera exécutée à chaque changement de l'état de la requête "readyState"
3. Vérifie que la requête est terminée et réussie : xmlhttp.readyState == 4 && xmlhttp.status == 200
	- xmlhttp.readyState == 4: état -> requête terminée et réponse prête 
	- xmlhttp.status == 200: status correspond au code HTTP renvoyé par le serveur
	200 signifie OK, c'est-à-dire que la requête a été traitée avec succès et que le 
	serveur a renvoyé la réponse attendue
4. Appelle la fonction fetchData() pour traiter le XML reçu  


## La fonction fetchData() permet de lire les données XML récupérées par la requête et à les afficher sous forme de tableau HTML.

1. Récupère le document XML renvoyé par le serveur : let xmlDoc = xmlhttp.responseXML;
2. Crée un tableau vide pour stocker les questions: data = [];
3. Récupère les éléments XML correspondant à la balise <question> : let x = xmlDoc.getElementsByTagName("question");
4. Parcourt les questions et remplit le tableau "data" avec les balises <question> en utilisant la méthode ".push" pour ajouter un ou plusieurs éléments à la fin d’un tableau : 
    for (i = 0; i < x.length; i++) {
        data.push(x[i]);   
     }
5. Appelle la fonction display data pour afficher les données sous forme de tableau HTML: displayData();

## La fonction displayData() permet de lire les données XML récupérées par la requête et à les afficher sous forme de tableau HTML.

1. Crée un tableau HTML stocké dans une chaine "table" initialisée avec les entêtes du tableau: let table = "<tr><th>#</th><th>Image</th><th>Thème</th><th>Question</th><th>Reponse 1</th><th>Reponse 2</th><th>Reponse 3</th><th>Reponse 4</th><th>Reponse Correcte</th><th>Point</th><th></th></tr>";
2. Parcourt les questions dans "data" et remplit le tableau avec les attributs d'une question dans une même ligne du tableau (id, theme, contenu, response1, response2, response3, response4, bonne_reponse, point) : 
	for (i = 0; i < data.length; i++) {
		table += "<tr><td>" +
        	data[i].getElementsByTagName("id")[0].textContent +
        	"</td>" +
        	"<td><img src='" +  data[i].getElementsByTagName("image")[0].textContent +
        	"' alt='image"+ idx +"' width='50px' height='50px'></img></td>" +
        	"<td>" +
        	data[i].getElementsByTagName("theme")[0].textContent +
        	"</td><td>" +
        	data[i].getElementsByTagName("contenu")[0].textContent +
        	"</td><td>" +
        	data[i].getElementsByTagName("response1")[0].textContent +
        	"</td><td>" + 
        	data[i].getElementsByTagName("response2")[0].textContent +
        	"</td><td>" +
        	data[i].getElementsByTagName("response3")[0].textContent +
        	"</td><td>" +
        	data[i].getElementsByTagName("response4")[0].textContent +
        	"</td><td>" +
        	data[i].getElementsByTagName("bonne_reponse")[0].textContent +
        	"</td><td>" +     
        	data[i].getElementsByTagName("point")[0].textContent +
        	"</td><td>" + 
        	"<a href='detail.html?id=" +
        	data[i].getElementsByTagName("id")[0].textContent +
        	"' class='a_details'>Details</a>" +
        	"</td></tr>";
	}
3. Affichage du tableau dans la page web en l'insérant dans l'élément HTML avec l'id "data" : 
 document.getElementById("data").innerHTML = table;


# Interface "Apprendre" - Manuel d'utilisation:

## Objectif: 
L'interface "Apprendre" permet au joueur de consulter les questions, voir les détails des questions pour apprendre à jouer.

## Accès:
1. Ouvrir le fichier index.html dans un navigateur web.
2. Cliquer sur l'onglet Apprendre dans le menu de navigation.

## Fonctionnalités:
1. Consulter la liste des questions paginée (10 questions par page).
2. Voir les détails d’une question avec une explication en cliquant sur le lien "Details" qui redirige l'utilisateur vers la page detail.html.
3. Filter les questions par thème (type de Pokémon : Eau, Feu, Plante, Psy, Poison, Électrick) avec la fonction filtrerData().
4. Trier les question selon un ordre décroissant des points attribués aux questions avec la fonction sortData().
5. Naviguer entre les pages de questions affichant les données des questions avec les boutons numérotés en bas de la page (10 questions par page) avec les fonctions showPageLinks() qui affiche les boutons de pages et loadPage(pageNumber) qui recharge les données correspondantes à afficher par page.
6. Navigation entre les interfaces du jeu via le menu de navigation.

## Remarques techniques:
_ Les données affichées proviennent du fichier XML bdd.xml déployé sur le serveur obiwan qui est chargé par la fonction loadXMLDoc().
_ Les questions sont stockées sous forme d'éléments <question> contenant leurs attributs (id, theme, contenu, réponses, etc).
_ Les fonctions principales sont: 
   . fetchData() -> récupère les questions depuis le XML, 
   . displayData() -> affiche les questions dans un tableau HTML, 
   . filterData() -> filtre selon le thème choisi de la liste déroulante, 
   . sortData() -> trie la liste des questions, 
   . showPageLinks() -> gère la pagination, 
   . rechercheData() -> recherche et affiche les éléments selon un thème choisi ou l'id de la question choisie.
