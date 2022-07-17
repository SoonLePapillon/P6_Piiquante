require('dotenv').config();
const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require('path');

const saucesRoutes = require("./routes/saucesRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");

mongoose.connect
  (process.env.DB_ACCESS, 
    { useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

///// Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse. ////
app.use((req, res, next) => { //middleware général sera appliqué à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*'); // toutes les origines ont le droit d'accéder à notre API avec '*'
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth/", usersRoutes);



module.exports = app; 