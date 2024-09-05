// Chemin vers le fichier JSON
const filePathAvis = '../json/avis.json';

// Fonction pour convertir la note en étoiles
function convertToStars(note) {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
}


// ------------------ AFFICHER LES AVIS ---------------------------

function afficherAvis(){
    fetch(filePathAvis)
    .then(response => response.json())
    .then(data => {
        // Afficher les avis
        const contenu = document.getElementById('avis_container');
        contenu.innerHTML = "";
        data.forEach(avis => {
            const avisElement = document.createElement('div');
            avisElement.className = 'avis_avis';
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

}


// -------------------- ECRIRE AVIS -------------------

document.addEventListener('DOMContentLoaded', () => {
    afficherAvis(); // Afficher les avis au chargement de la page

    // Écouter la soumission du formulaire pour ajouter un avis
    document.getElementById('form-avis').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page

        // Récupérer les valeurs du formulaire
        const nom = this.nom.value.trim();
        const note = parseInt(this.note.value.trim());
        var date = new Date();
        const description = this.description.value.trim();

        const datePropre = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()

        // Valider les données du formulaire
        if (nom === '' || isNaN(note) || note < 1 || note > 5 || date === '' || description === '') {
            alert('Veuillez remplir tous les champs correctement.');
            return;
        }

        // Créer un nouvel objet avis
        const nouvelAvis = {
            nom: nom,
            note: note,
            date: datePropre,
            description: description
        };

        // Envoyer les données au serveur pour les ajouter
        fetch('/avisJSON', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouvelAvis)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                afficherAvis(); // Mettre à jour l'affichage des avis
                this.reset(); // Réinitialiser le formulaire
            } else {
                alert('Erreur lors de l\'ajout de l\'avis.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
});