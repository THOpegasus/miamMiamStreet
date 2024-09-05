// Chemin vers le fichier JSON
const filePathPlats = '../json/plats.json';
console.log("bbbbbbbbbbbbbbbbbbbbbb");

afficherPlats();
// ------------------ AFFICHER LES AVIS ---------------------------

function afficherPlats(){
    fetch(filePathPlats)
    .then(response => response.json())
    .then(data => {
        // Afficher les avis
        console.log("haaaaaaaaaaaaaaaa")
        const contenu = document.getElementById('plats_container');
        contenu.innerHTML = "";
        data.forEach(plat => {
            const platElement = document.createElement('a');
            platElement.className = 'plat';
            platElement.href= 'platDetail.html?nom='+ plat.nom;
            platElement.innerHTML = `

                <img src="${plat.img}" alt="paella">
                <h2 class="plat_nom">
                    ${plat.nom}
                </h2>
                <p class="plat_description">
                ${plat.description}
                </p>



            `;
            contenu.appendChild(platElement);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du fichier JSON:', error);
    });

}


