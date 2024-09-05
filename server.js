const express = require('express');
const path = require('path');
const session = require('express-session')
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 2000;

const mdpAdmin = "1234";


app.use(bodyParser.json());

// Définition du répertoire contenant les fichiers statiques
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

const partenairesFilePath = path.join(__dirname, 'public', 'json', 'partenaires.json');
const avisFilePath = path.join(__dirname, 'public', 'json', 'avis.json');
const ouMeTrouverFilePath = path.join(__dirname, 'public', 'json', 'ou_me_trouver.txt');
const quiSuisJeFilePath = path.join(__dirname, 'public', 'json', 'qui_suis_je.txt');
const platsFilePath = path.join(__dirname, 'public', 'json', 'plats.json');


app.use(session({
  secret: 'clé_secréte_de_zinzin',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Vous pouvez ajuster les options du cookie selon vos besoins
}));

//GESTION IMAGE UPLOAD

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'photo', 'plat')); // Répertoire pour les images
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Nom de fichier unique basé sur la date
  }
});

const upload = multer({ storage: storage });





// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });


// Route pour la page login
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// Route pour la page plats
app.get('/plats', (req, res) => {
  res.sendFile(path.join(publicPath, 'plats.html'));
});

// Route pour la page avis
app.get('/avis', (req, res) => {
  res.sendFile(path.join(publicPath, 'avis.html'));
});

// Route pour la page photo video
app.get('/photoVideo', (req, res) => {
  res.sendFile(path.join(publicPath, 'photoVideo.html'));
});


// Route pour la page plats detail admin
app.get('/plat/:nom', (req, res) => {
  console.log("fzegfzegze");
  const nom = req.params.nom;
   // Vérification de la session utilisateur pour accéder au plat detail
   if (req.session && req.session.user && req.session.user.valide) {
    res.sendFile(path.join(publicPath, 'platDetailAdmin.html'));
  } else {
    res.redirect('/login'); // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  }
});


app.post('/connexion', (req, res) => {
  const { mdp } = req.body; // Récupère directement la valeur de mdp

  console.log('Mot de passe admin :', mdpAdmin);
  console.log('Mot de passe saisi :', mdp);

  if (mdp === mdpAdmin) { // Compare directement la valeur de mdp avec mdpAdmin
    req.session.user = { valide: "True" };
    res.json({ success: true }); // Connexion réussie
  } else {
    console.log("Mot de passe incorrect");
    res.json({ success: false, message: "Mot de passe incorrect" }); // Connexion échouée
  }
});


app.get('/admin', (req, res) => {
  // Vérification de la session utilisateur pour accéder au menu
  if (req.session && req.session.user && req.session.user.valide) {
    res.sendFile(path.join(publicPath, 'admin.html'));
  } else {
    res.redirect('/login'); // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
  }
});




// -------------------- ADMIN ------------------------


//------- OU ME TROUVER ----------

app.post('/saveOuMeTrouver', (req, res) => {
  const content = req.body.content;
 
  fs.writeFile(ouMeTrouverFilePath, content, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du fichier:', err);
      return res.status(500).send('Erreur lors de la sauvegarde du fichier');
    }
    res.send('Fichier sauvegardé avec succès');
  });
});

//------- QUI SUIS JE ----------

app.post('/saveQuiSuisJe', (req, res) => {
  const content = req.body.content;
 
  fs.writeFile(quiSuisJeFilePath, content, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du fichier:', err);
      return res.status(500).send('Erreur lors de la sauvegarde du fichier');
    }
    res.send('Fichier sauvegardé avec succès');
  });
});

//------- PLAT ----------

// Routes pour gérer les plats
// Route pour récupérer tous les plats
app.get('/plats', (req, res) => {
  fs.readFile(platsFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur serveur');
          return;
      }
      const plats = JSON.parse(data);
      res.json(plats);
  });
});

// Route pour récupérer un plat par nom
app.get('/plats/:nom', (req, res) => {
  const nom = req.params.nom;
  fs.readFile(platsFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur serveur');
          return;
      }
      const plats = JSON.parse(data);
      const plat = plats.find(p => p.nom === nom);
      if (plat) {
          res.json(plat);
      } else {
          res.status(404).send('Plat non trouvé');
      }
  });
});

app.post('/plats', upload.single('img'), (req, res) => {
  const nouveauPlat = req.body;
  console.log(nouveauPlat);
  
  // Log pour vérifier que le fichier est bien reçu
  console.log("Fichier reçu:", req.file);

  if (req.file) {
      // Ajout du chemin d'accès de l'image
      nouveauPlat.img = `/photo/plat/${req.file.filename}`;
  } else {
      // Si aucun fichier n'a été téléchargé
      console.warn('Aucun fichier reçu pour l\'image');
      nouveauPlat.img = null;  // ou laisser vide ou une image par défaut
  }

  fs.readFile(platsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON:', err);
      res.status(500).send('Erreur serveur');
      return;
    }

    let plats = JSON.parse(data);
    plats.push(nouveauPlat);

    fs.writeFile(platsFilePath, JSON.stringify(plats, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture dans le fichier JSON:', err);
        res.status(500).send('Erreur serveur');
        return;
      }

      res.json({ success: true });
    });
  });
});



// Route pour mettre à jour un plat existant
app.put('/plats/:nom', upload.single('img'), (req, res) => {
  const nom = req.params.nom;
  const updatedPlat = req.body;


  // Log pour vérifier que le fichier est bien reçu
  console.log("Fichier reçu:", req.file);

  if (req.file) {
      // Ajout du chemin d'accès de l'image
      updatedPlat.img = `/photo/plat/${req.file.filename}`;
  }


  fs.readFile(platsFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur serveur');
          return;
      }
      let plats = JSON.parse(data);
      const index = plats.findIndex(p => p.nom === nom);
      if (index !== -1) {
          plats[index] = updatedPlat;
          fs.writeFile(platsFilePath, JSON.stringify(plats, null, 2), 'utf8', (err) => {
              if (err) {
                  console.error(err);
                  res.status(500).send('Erreur serveur');
                  return;
              }
              res.json({ success: true });
          });
      } else {
          res.status(404).send('Plat non trouvé');
      }
  });
});

// Route pour supprimer un plat
app.delete('/plats/:nom', (req, res) => {
  const nom = req.params.nom;
  fs.readFile(platsFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erreur serveur');
          return;
      }
      let plats = JSON.parse(data);
      plats = plats.filter(p => p.nom !== nom);
      fs.writeFile(platsFilePath, JSON.stringify(plats, null, 2), 'utf8', (err) => {
          if (err) {
              console.error(err);
              res.status(500).send('Erreur serveur');
              return;
          }
          res.json({ success: true });
      });
  });
});





//------- AVIS ----------




// Fonction pour lire les avis depuis le fichier JSON
const lireAvis = () => {
  if (fs.existsSync(avisFilePath)) {
      const data = fs.readFileSync(avisFilePath, 'utf8');
      return JSON.parse(data);
  }
  return [];
};

// Fonction pour écrire les avis dans le fichier JSON
const ecrireAvis = (avis) => {
  fs.writeFileSync(avisFilePath, JSON.stringify(avis, null, 2));
};


app.get('/avisJSON', (req, res) => {
  const avis = lireAvis();
  console.log(avis);
  res.json(avis);
});

app.post('/avisJSON', (req, res) => {
  const nouvelAvis = req.body;
  const avis = lireAvis();
  avis.push(nouvelAvis);
  ecrireAvis(avis);
  res.json({ success: true });
});

app.delete('/avis/:nom', (req, res) => {
  const nomAvis = req.params.nom;
  let avis = lireAvis();
  avis = avis.filter(avis => avis.nom !== nomAvis);
  ecrireAvis(avis);
  res.json({ success: true });
});




//------- PARTENAIRE ----------

const lirePartenaires = () => {
  if (fs.existsSync(partenairesFilePath)) {
      const data = fs.readFileSync(partenairesFilePath);
      return JSON.parse(data);
  }
  return [];
};

// Fonction pour écrire les partenaires dans le fichier JSON
const ecrirePartenaires = (partenaires) => {
  fs.writeFileSync(partenairesFilePath, JSON.stringify(partenaires, null, 2));
};

app.get('/partenaires', (req, res) => {
  const partenaires = lirePartenaires();
  res.json(partenaires);
});

app.post('/partenaires', (req, res) => {
  const nouveauPartenaire = req.body;
  const partenaires = lirePartenaires();
  partenaires.push(nouveauPartenaire);
  ecrirePartenaires(partenaires);
  res.json({ success: true });
});

app.delete('/partenaires/:nom', (req, res) => {
  const nomPartenaire = req.params.nom;
  let partenaires = lirePartenaires();
  partenaires = partenaires.filter(partenaire => partenaire.nom !== nomPartenaire);
  ecrirePartenaires(partenaires);
  res.json({ success: true });
});





















app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
