const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // on ajoute le middleware auth sur les routes qu'on veut protéger
const saucesCtrl = require('../controllers/saucesControllers.js');
const multer = require("../middleware/multer-config.js");

router.post('/', auth, multer, saucesCtrl.createSauce); // On met bien le multer après l'authentification sinon qq peut envoyer un fichier sans être authentifié
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);  // le : dit à express que cette partie de la route est dynamique
router.put('/:id', auth, multer, saucesCtrl.modifySauce);  // le : dit à express que cette partie de la route est dynamique
router.delete('/:id', auth, saucesCtrl.deleteSauce);  // le : dit à express que cette partie de la route est dynamique

module.exports = router;