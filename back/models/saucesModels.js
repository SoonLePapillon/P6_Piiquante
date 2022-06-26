const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({ // fonction schema mise à dispostion par le package mongoose
  userId: {type: String, required:true},
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true},
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislike: { type: Number, default: 0 },
  usersLiked: { type: [String]},
  usersDisliked: { type: [String]}
});

module.exports = mongoose.model('Sauces', sauceSchema);