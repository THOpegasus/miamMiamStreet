
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêcher le rechargement de la page
  
    const mdp = document.getElementById('mdpLogin').value.trim();
  
    if (mdp) {
        console.log('Mot de passe saisi :', mdp);
        try {
            const response = await fetch('/connexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mdp })
            });
  
            const data = await response.json();
            if (data.success) {
                window.location.href = '/admin'; // Redirection vers la page d'accueil si l'authentification est réussie
            } else {
                alert('Identifiants incorrects');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur de connexion');
        }
    } else {
        alert('Veuillez remplir tous les champs');
    }
});
