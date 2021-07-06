// utilisation de bcrypt pour securisé le mdp afin qu'il soit hasher
const bcrypt = require('bcrypt');
// utilisation de jsonwebtoken pour création de token lorsqu'un utilisateur se connecte
const jwt = require('jsonwebtoken');
// modele user
const User = require('../models/User');

// Création d'un nouvel user
exports.signup = (req, res, next) => {
  // utilisation de bcrypt (le 10 c'est le nombre de tours qu'on veux faire faire à l'algo + c'est élevé + ce sera long)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
          // Création du new user
            const user = new User({
                email: req.body.email,
                password: hash 
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};
// Vérification si l'utilisateur existe déjà dans la base de donnée MondoDB
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // si oui verification du mdp 
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }

            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};