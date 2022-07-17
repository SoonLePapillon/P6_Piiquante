const Sauce = require('../models/saucesModels.js');
const User = require('../models/usersModels.js');
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // req.protocole pour http(s)
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then((sauce) => {
     res.status(200).json(sauce);
    })
  .catch((error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {;
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if(req.auth.userId !== sauce.userId) {
      return res.status(401).json({message: 'vous ne pouvez pas modifier cette sauce'})
    }
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
        .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'une erreur est survenue'});
  })
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.checkScore = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .catch((error) => {
    res.status(404).json({
      error: error
    })
  })
  .then((sauce) => { 
    switch (req.body.like) {
    case 1 : // pouce vert
      if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) { // pour empêcher de faire la requête depuis Insomnia
        res.status(409).json({error : "Sauce already liked/disliked"})
      } else {
        sauce.likes++
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
        res.status(200).json(sauce);
      }
      break;
    case -1 : // pouce rouge
      if (sauce.usersLiked.includes(req.body.userId) || sauce.usersDisliked.includes(req.body.userId)) {
        res.status(409).json({error : "Sauce already liked/disliked"})
      } else {
        sauce.dislikes++
        sauce.usersDisliked.push(req.body.userId);
        sauce.save();
        res.status(200).json(sauce);
      }
      break;
    case 0 : // Si on rappuie sur un pouce sur lequel on avait déjà appuyé
      if (sauce.usersLiked.includes(req.body.userId)) {
        index = sauce.usersLiked.indexOf(req.body.userId);
        sauce.usersLiked.splice(index, 1);
        sauce.likes--;
      }
      if (sauce.usersDisliked.includes(req.body.userId)) {
        index = sauce.usersDisliked.indexOf(req.body.userId);
        sauce.usersDisliked.splice(index, 1);
        sauce.dislikes--;
      }
      sauce.save();
      res.status(200).json(sauce);
      break;
    }
    // console.log(sauce)
  })
}

