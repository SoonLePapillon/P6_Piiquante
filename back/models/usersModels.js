const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //améliore les messages d'erreur lors de l'enregistrement de données uniques.

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique : true pour éviter qu'on puisse s'inscrire plusieurs fois avec la même adresse mail
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); // On applique le validator au schéma. 

module.exports = mongoose.model('User', userSchema);