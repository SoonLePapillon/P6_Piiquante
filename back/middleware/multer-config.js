const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ // la méthode dickStorage() configure le chemin et le nom de fichier pour les fichiers entrants
  destination: (req, file, callback) => { // destination : dans quel dossier enregistrer l'image
    callback(null, 'images'); // null = pas d'erreur
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // on prend le nom de base du fichier et on remplace les espaces par des _ 
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image'); // .single pour dire qu'il s'agit d'un fichier unique (et image signifie qu'il s'agit d'image uniquement)