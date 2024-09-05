// Chemin vers le fichier JSON
const filePathAvis = '../json/avis.json';
const filePathPartenaire = '../json/partenaires.json';
const filePathOuMeTrouver = '../json/ou_me_trouver.txt';
const filePathQuiSuisJe = '../json/qui_suis_je.txt';


// Fonction pour convertir la note en étoiles
function convertToStars(note) {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
}


// ------------------ AFFICHER ou_me_trouver ---------------------------

// Charger le contenu du fichier texte statique
fetch(filePathOuMeTrouver)
    .then(response => response.text())
    .then(data => {
        document.getElementById('ou_me_trouver').innerText = data;
})
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
});

// ------------------ AFFICHER QUI SUIS JE ---------------------------

// Charger le contenu du fichier texte statique
fetch(filePathQuiSuisJe)
    .then(response => response.text())
    .then(data => {
        document.getElementById('qui_suis_je').innerText = data;
})
    .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
});




// ------------------ AFFICHER LES AVIS ---------------------------


fetch(filePathAvis)
    .then(response => response.json())
    .then(data => {
        // Afficher les avis
        const contenu = document.getElementById('avis_container');
        data.slice(0, 3).forEach(avis => {
            const avisElement = document.createElement('div');
            avisElement.className = 'avis';
            avisElement.innerHTML = `

                <div class="avis_top_container">
                    <div class="avis_gauche">
                        <div class="avis_nom">
                            <h3>${avis.nom}</h3>
                        </div>
                        <div class="avis_note">
                            <h3>${convertToStars(avis.note)}</h3>
                        </div>
                    </div>
                    
                    <div class="avis_date">
                        <h3>${avis.date}</h3>
                    </div>
                </div>
                <div class="avis_text">
                    <p>
                        ${avis.description}
                    </p>
                </div>



            `;
            contenu.appendChild(avisElement);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON:', error);
    });



    // ------------------ AFFICHER LES PARTENAIRES ---------------------------






// Utiliser fetch pour récupérer le fichier JSON
fetch(filePathPartenaire)
    .then(response => response.json())
    .then(data => {
        console.log('erferf');
        // Afficher les partenaire
        const partenairecontenu = document.getElementById('partenaire_liste');
        data.forEach(partenaire => {
            const partenaireElement = document.createElement('div');
            partenaireElement.className = 'partenaire';
            partenaireElement.innerHTML = `

                <a href="${partenaire.url}">
                    <img src="${partenaire.image}" alt="${partenaire.nom}">
                </a>



            `;
            partenairecontenu.appendChild(partenaireElement);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON:', error);
    });