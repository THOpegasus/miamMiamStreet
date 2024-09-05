// Chemin vers le fichier JSON
const filePathAvis = '../json/avis.json';
const filePathPartenaire = '../json/partenaire.json';
const filePathOuMeTrouver = '../json/ou_me_trouver.txt';
const filePathQuiSuisJe = '../json/qui_suis_je.txt';
const filePathPlats = '../json/plats.json';

// recuperation de toutes les div
const ou_me_trouver = document.getElementById("ou_me_trouver");
const qui_suis_je = document.getElementById("qui_suis_je");
const plat_proposer = document.getElementById("plat_proposer");
const les_avis = document.getElementById("les_avis");
const partenaire = document.getElementById("partenaire");

// Fonction pour convertir la note en étoiles
function convertToStars(note) {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
}

function allDisplayNone(){
    ou_me_trouver.style.display = "none";
    qui_suis_je.style.display = "none";
    plat_proposer.style.display = "none";
    les_avis.style.display = "none";
    partenaire.style.display = "none";
}

allDisplayNone();

document.getElementById("menu_ou_me_trouver").addEventListener("click", afficherOuMeTrouver);
document.getElementById("menu_qui_suis_je").addEventListener("click", afficherQuiSuisJe);
document.getElementById("menu_plats").addEventListener("click", afficherPlats);
document.getElementById("menu_avis").addEventListener("click", afficherAvis);
document.getElementById("menu_partenaires").addEventListener("click", afficherPartenaires);







// ----------------------  OU ME TROUVER  --------------------------

// afficher ou me trouver
function afficherOuMeTrouver() {

    allDisplayNone();

    ou_me_trouver.style.display = "flex";
    console.log("ou_me_trouver AFFICHER")

        // Charger le contenu du fichier texte statique
    fetch(filePathOuMeTrouver)
        .then(response => response.text())
        .then(data => {
        document.getElementById('fileContent').value = data;
        })
        .catch(error => {
        console.error('Erreur lors du chargement du fichier:', error);
        });
}




// Gérer la soumission du formulaire
document.getElementById('form-ou-me-trouver').addEventListener('submit', function(event) {
    event.preventDefault();
    const modifiedContent = document.getElementById('fileContent').value;
    console.log('Contenu modifié:', modifiedContent);
    
     // Envoyer le contenu modifié au serveur pour le sauvegarder
     fetch('/saveOuMeTrouver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: modifiedContent })
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde du fichier:', error);
      });

});


// ----------------------  QUI SUIS JE  --------------------------

// afficher qui suis je
function afficherQuiSuisJe() {

    allDisplayNone();

    qui_suis_je.style.display = "flex";
    console.log("qui_suis_je AFFICHER")

    
    // Charger le contenu du fichier texte statique
    fetch(filePathQuiSuisJe)
    .then(response => response.text())
    .then(data => {
    document.getElementById('fileContentQui').value = data;
    })
    .catch(error => {
    console.error('Erreur lors du chargement du fichier:', error);
    });
}



// Gérer la soumission du formulaire
document.getElementById('form-qui-suis-je').addEventListener('submit', function(event) {
    event.preventDefault();
    const modifiedContent = document.getElementById('fileContentQui').value;
    console.log('Contenu modifié:', modifiedContent);
    
     // Envoyer le contenu modifié au serveur pour le sauvegarder
     fetch('/saveQuiSuisJe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: modifiedContent })
      })
      .then(response => response.text())
      .then(data => {
        alert(data);
      })
      .catch(error => {
        console.error('Erreur lors de la sauvegarde du fichier:', error);
      });

});

// ----------------------  PLATS  --------------------------


// Fonction pour afficher les avis depuis le serveur
// Fonction pour afficher les plats depuis le serveur
function afficherPlats(){
    allDisplayNone();

    const plat_proposer = document.getElementById('plat_proposer');
    plat_proposer.style.display = "flex";
    console.log("PLATS AFFICHER");

    fetch(filePathPlats)
    .then(response => response.json())
    .then(data => {
        const contenu = document.getElementById('plats_container');
        contenu.innerHTML = "";
        data.forEach(plat => {
            const platElement = document.createElement('form');
            platElement.className = 'platDetail';
            platElement.id = 'form-plat-' + plat.nom;
            platElement.innerHTML = `
                <div class="platDetail_gauche_admin">
                    <input class="platDetail_img" type="file" id="platDetail_img_${plat.nom}"  accept="image/*" >
                    </input>
                    <div class="platDetail_gauche_bottom">
                        <input class="platDetail_nom" id="platDetail_nom_${plat.nom}">
                        </input>
                        <input class="platDetail_prix" id="platDetail_prix_${plat.nom}">
                        </input>
                    </div>
                </div>
                <div class="platDetail_droit">
                    <textarea id="platDetail_description_${plat.nom}">
                    </textarea>
                </div>
                <div class="platDetail_save" id="platDetail_save_${plat.nom}">
                    <input type="submit" value="Enregistrer les modifications">
                </div
            `;
            contenu.appendChild(platElement);

            console.log("ouiiiiiiiiiiii")

            const nom_input = document.getElementById("platDetail_nom_" + plat.nom);
            const prix_input = document.getElementById("platDetail_prix_" + plat.nom);
            const detail_textarea = document.getElementById("platDetail_description_" + plat.nom);
            const img_input = document.getElementById("platDetail_img_" + plat.nom);

            console.log(plat.img);

            nom_input.value = plat.nom;
            prix_input.value = plat.prix;
            detail_textarea.value = plat.description;
            img_input.style.backgroundImage = "url(.."+plat.img+")";

            // Bouton pour supprimer le plat
            const platDetail_save = document.getElementById("platDetail_save_" + plat.nom);
            const boutonSupprimer = document.createElement('button');
            boutonSupprimer.className = 'boutonSupprimer_plats';
            boutonSupprimer.textContent = 'Supprimer';
            boutonSupprimer.addEventListener('click', (event) => {
                event.preventDefault();
                fetch(`/plats/${plat.nom}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        afficherPlats(); // Mettre à jour l'affichage des plats
                    } else {
                        alert('Erreur lors de la suppression du plat.');
                    }
                })
                .catch(error => console.error('Erreur:', error));
            });
            platDetail_save.appendChild(boutonSupprimer);

            // Gérer la soumission du formulaire pour les modifications
            platElement.addEventListener('submit', function(event) {
                event.preventDefault();
                const modifiedNom = nom_input.value;
                const modifiedPrix = prix_input.value;
                const modifiedDescription = detail_textarea.value;
                const modifiedImg = img_input.value;
                console.log(modifiedImg);
                console.log('Contenu modifié:', modifiedNom, modifiedPrix, modifiedDescription, modifiedImg);
                
                const formData = new FormData();
                formData.append('nom', nom_input.value);
                formData.append('prix', prix_input.value);
                formData.append('description', detail_textarea.value);
                
                const fileInput = img_input;
                if (fileInput.files.length > 0) {
                    formData.append('img', fileInput.files[0]);
                }
            
                console.log("--------------------------------------------");
                console.log(fileInput.files[0]);
                console.log('Nouveau plat:', formData);
            
                // Envoyer le FormData au serveur pour le sauvegarder
                fetch('/plats/' + plat.nom, {
                    method: 'PUT',
                    body: formData // Pas besoin de spécifier 'Content-Type', fetch le fera automatiquement pour multipart/form-data
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Modifications sauvegardées.');
                        afficherPlats(); // Rafraîchir la liste des plats
                    } else {
                        alert('Erreur lors de la sauvegarde des modifications.');
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la sauvegarde du fichier:', error);
                });
            });
        });
        rajouterPlat();
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON:', error);
    });


}


function rajouterPlat() {
    const contenu = document.getElementById('plats_container');
    const platElement = document.createElement('form');
    platElement.className = 'platDetail';
    platElement.id = 'form-plat-nouveau';
    platElement.innerHTML = `
        <div class="platDetail_gauche_admin">
            <input class="platDetail_img" type="file" id="platDetail_img_nouveau" accept="image/*" required>
            <div class="platDetail_gauche_bottom">
                <input class="platDetail_nom" id="platDetail_nom_nouveau">
                </input>
                <input class="platDetail_prix" id="platDetail_prix_nouveau">
                </input>
            </div>
        </div>
        <div class="platDetail_droit">
            <textarea id="platDetail_description_nouveau"></textarea>
        </div>
        <input type="submit" value="Enregistrer les modifications">
    `;
    contenu.appendChild(platElement);

    platElement.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Créer un objet FormData pour gérer les données du formulaire, y compris le fichier image
        const formData = new FormData();
        formData.append('nom', document.getElementById('platDetail_nom_nouveau').value);
        formData.append('prix', document.getElementById('platDetail_prix_nouveau').value);
        formData.append('description', document.getElementById('platDetail_description_nouveau').value);
        
        const fileInput = document.getElementById('platDetail_img_nouveau');
        if (fileInput.files.length > 0) {
            formData.append('img', fileInput.files[0]);
        }
    
        console.log("--------------------------------------------");
        console.log(fileInput.files[0]);
        console.log('Nouveau plat:', formData);
    
        // Envoyer le FormData au serveur pour le sauvegarder
        fetch('/plats', {
            method: 'POST',
            body: formData // Pas besoin de spécifier 'Content-Type', fetch le fera automatiquement pour multipart/form-data
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Plat ajouté avec succès.');
                afficherPlats(); // Rafraîchir la liste des plats
            } else {
                alert('Erreur lors de l\'ajout du plat.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du plat:', error);
        });
    });



}


// ----------------------  AVIS  --------------------------


//Afficher Avis


// Fonction pour afficher les avis depuis le serveur
function afficherAvis(){
    
    allDisplayNone();

    les_avis.style.display = "flex";
    console.log("AVIS AFFICHER")





    fetch(filePathAvis)
    .then(response => response.json())
    .then(data => {
        // Afficher les avis
        const contenu = document.getElementById('avis_container');
        contenu.innerHTML = "";
        console.log('est');
        console.log(data);
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

            // Bouton pour supprimer l'avis
            const boutonSupprimer = document.createElement('button');
            boutonSupprimer.textContent = 'Supprimer';
            boutonSupprimer.addEventListener('click', () => {
                fetch(`/avis/${avis.nom}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        afficherAvis(); // Mettre à jour l'affichage des avis
                    } else {
                        alert('Erreur lors de la suppression de l\'avis.');
                    }
                })
                .catch(error => console.error('Erreur:', error));
            });
            avisElement.appendChild(boutonSupprimer);

            return avisElement;


        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON:', error);
    });

}



// ----------------------  PARTENAIRE  --------------------------



// Écouter la soumission du formulaire pour ajouter un partenaire
document.getElementById('form-partenaire').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs du formulaire
    const nom = this.nom.value.trim();
    const url = this.url.value.trim();
    const image = this.image.value.trim();

    // Valider les données du formulaire
    if (nom === '' || url === '' || image === '') {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }

    // Créer un nouvel objet partenaire
    const nouveauPartenaire = {
        nom: nom,
        url: url,
        image: image
    };

    // Envoyer les données au serveur pour les ajouter
    fetch('/partenaires', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nouveauPartenaire)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            afficherPartenaires(); // Mettre à jour l'affichage des partenaires
            this.reset(); // Réinitialiser le formulaire
        } else {
            alert('Erreur lors de l\'ajout du partenaire.');
        }
    })
    .catch(error => console.error('Erreur:', error));
});


// Fonction pour afficher les partenaires depuis le serveur
function afficherPartenaires() {
    console.log("Partenaires AFFICHER")
    allDisplayNone();

    partenaire.style.display = "flex";

    fetch('/partenaires')
        .then(response => response.json())
        .then(partenaires => {
            console.log("prout");
            const listePartenaires = document.getElementById('partenaire_liste');
            listePartenaires.innerHTML = ''; // Effacer le contenu précédent

            partenaires.forEach(partenaire => {
                const partenaireElement = creerPartenaireElement(partenaire);
                listePartenaires.appendChild(partenaireElement);
            });
        })
        .catch(error => console.error('Erreur:', error));
}

// Fonction pour créer un élément HTML pour un partenaire à partir d'un objet partenaire
function creerPartenaireElement(partenaire) {
    const partenaireElement = document.createElement('div');
    partenaireElement.classList.add('partenaire');

    const imageElement = document.createElement('img');
    imageElement.src = partenaire.image;
    imageElement.alt = partenaire.nom;
/*
    const nomElement = document.createElement('div');
    nomElement.classList.add('nom');
    nomElement.textContent = partenaire.nom;

*/
    const urlElement = document.createElement('a');
    urlElement.href = partenaire.url;

    partenaireElement.appendChild(urlElement);
    urlElement.appendChild(imageElement);

    // Bouton pour supprimer le partenaire
    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.textContent = 'Supprimer';
    boutonSupprimer.addEventListener('click', () => {
        fetch(`/partenaires/${partenaire.nom}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                afficherPartenaires(); // Mettre à jour l'affichage des partenaires
            } else {
                alert('Erreur lors de la suppression du partenaire.');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
    partenaireElement.appendChild(boutonSupprimer);

    return partenaireElement;
}




