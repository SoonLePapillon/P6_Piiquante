const express = require("express"); // On importe express
const app = express(); // L'application utilise express
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const saucesRoutes = require("./routes/saucesRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");

mongoose.connect
  ("mongodb+srv://SoonLePapillon:Birlakhdar75015@sooncluster.padum.mongodb.net/sauces?retryWrites=true&w=majority", 
    { useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // ce middleware intercèpte toutes les requêtes qui ont un content type json (qui contiennent du json) et met à disposition leur body directement sur l'objet req, ce qui permet d'écrire lemiddleware post un peu plus bas

///// Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse. ////
app.use((req, res, next) => { //middleware général sans routes car il sera appliqué à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*'); // toutes les origines ont le droit d'accéder à notre API avec '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); // pour servir un dossier statique on ujse express.static
// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images . 
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth/", usersRoutes);



module.exports = app; // On exporte cette application pour pouvoir la réutiliser ailleurs notamment depuis server.js