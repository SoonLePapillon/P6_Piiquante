const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseErrors = require('mongoose-errors')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // unique : true pour éviter qu'on puisse s'inscrire plusieurs fois avec la même adresse mail
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseErrors);

module.exports = mongoose.model('User', userSchema);