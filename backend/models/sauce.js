const mongoose = require('mongoose');

// Création d'un schema mangoose 
const sauceSchema = mongoose.Schema({
    // UserId de l'utilisateur qui créé la sauce
  userId: {
    type: String,
    required: true
  },
  // Nom de la sauce
  name: {
    type: String,
    required: true,
  },
  // Fabricant de la sauce
  manufacturer: {
    type: String,
    required: true,
  },
  // Description de la sauce
  description: {
    type: String,
    required: true,
  },
  // Ingredient principal de la sauce
  mainPepper: {
    type: String,
    required: true,
  },
  // Image de la sauce téléchargé par l'utilisateur
  imageUrl: {
    type: String,
    required: true
  },
  // Niveau de piment
  heat: {
    type: Number,
    required: true
  },
  // nombre de Like reçu
  likes: {
    type: Number
  },
  // nombre de dislike reçu
  dislikes: {
    type: Number
  },
  // Tableau d'utilisateurs qui Like la sauce
  usersLiked: {
    type: [String]
  },
  // Tableau d'utilisateur qui Dislike la sauce
  usersDisliked: {
    type: [String]
  },
})

module.exports = mongoose.model('Sauce', sauceSchema);