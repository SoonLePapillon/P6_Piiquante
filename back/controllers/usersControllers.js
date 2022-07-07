const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/usersModels.js");

// use une clé spécifique pour bcrypt
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 tours de hashage pour un mdp secure
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error })); // 500 pour les erreurs serv
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // pour trouver l'user (s'il existe). On compare l'adresse mail envoyée avec le formulaire à l'adresse mail dans la bdd 
      .then(user => {
        if (!user) { // Si on n'a pas trouvé de user (donc false)
          return res.status(401).json({ error: 'Utilisateur non trouvé !' }); // 401 = non autorisé
        }
        bcrypt.compare(req.body.password, user.password) // on compare le mdp qu'a saisi l'user au hash présent dans le bdd
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ // on renvoie un objet JSON avec l'id et un token qui permet la connexion de l'user
              userId: user._id,
              token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN,
                { expiresIn: "24h"} // chaque token durera 24h
              )
            });
          })
          .catch(error => res.status(500).json({ error })); // S'il y a un problème de connexion, un pb lié à Mongodb par exemple
      })
      .catch(error => res.status(500).json({ error })); // S'il y a un problème de connexion, un pb lié à Mongodb par exemple
};