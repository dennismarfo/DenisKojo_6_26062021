const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// On crée notre schéma de données dédié à l'utilisateur
const userSchema = mongoose.Schema({
    // L'email doit être unique
    email: {
      type: String,
      unique: true,
      required: [true, "Veuillez entrer votre adresse email"],
      match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Veuillez entrer une adresse email correcte"]
    },
    // enregistrement du mot de pass
    password: {
      type: String,
      required: [true, "Veuillez choisir un mot de passe"]
    }
  });

  userSchema.plugin(uniqueValidator);

  module.exports = mongoose.model('User', userSchema);