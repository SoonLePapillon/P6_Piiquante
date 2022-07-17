const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/usersModels.js");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 tours de hashage
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error })); 
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // pour trouver l'user, s'il existe
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) // on compare le mdp qu'a saisi l'user au hash présent dans le bdd
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({ 
              userId: user._id,
              token: jwt.sign(
                {userId: user._id},
                process.env.TOKEN,
                { expiresIn: "24h"}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error })); // S'il y a un problème de connexion, un pb lié à Mongodb par exemple
};