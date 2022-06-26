const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // la méthode dickStorage() configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => {
    callback(null, 'images'); // null = pas d'erreur
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // remplace les espace par des _ 
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); // single créé un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré