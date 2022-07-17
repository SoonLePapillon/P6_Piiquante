const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // on l'ajoute sur les routes qu'on veut protéger
const saucesCtrl = require('../controllers/saucesControllers.js');
const multer = require("../middleware/multer-config.js");

router.post('/', auth, multer, saucesCtrl.createSauce); // multer après l'authentification sinon qlq peut envoyer un fichier sans être authentifié
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce); 
router.put('/:id', auth, multer, saucesCtrl.modifySauce);  
router.delete('/:id', auth, saucesCtrl.deleteSauce);  
router.post("/:id/like", auth, saucesCtrl.checkScore);

module.exports = router;