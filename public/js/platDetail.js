document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const nomPlat = urlParams.get('nom');
    console.log(nomPlat);
    if (nomPlat) {
        fetch(`/plats/${nomPlat}`)
            .then(response => response.json())
            .then(plat => {
                console.log("cest good")
                const platDetail_nom = document.getElementById('platDetail_nom');
                const platDetail_prix = document.getElementById('platDetail_prix');
                const platDetail_description = document.getElementById('platDetail_description');
                const platDetail_img = document.getElementById('platDetail_img');
                platDetail_nom.innerHTML = `${plat.nom}`;
                platDetail_prix.innerHTML = `${plat.prix}`;
                platDetail_description.innerText = `${plat.description}`;
                platDetail_img.style.backgroundImage = "url(.."+plat.img+")";
            })
            .catch(error => console.error('Erreur:', error));
    } else {
        const platDetail = document.getElementById('plat_detail');
        platDetail.innerHTML = '<p>Plat non trouvé</p>';
    }
});
