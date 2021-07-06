// Logique metier

// Récupération du modèle 'sauce'
const Sauce = require("../models/sauce");
// Installation du module 'fs' pour file systeme pour la gestion des modification et téléchargement d'images
const fs = require('fs');


// Création de sauces

exports.createSauce = (req, res, next) => {
    //Stockage des donnée du front-end dans une variable en objet JS
    const sauceObject = JSON.parse(req.body.sauce);
      // On supprime l'id généré automatiquement et envoyé par le front-end.
    delete sauceObject._id;
    // Création d'une instance du modèle sauce
    const sauce = new Sauce({
        ...sauceObject,
        // Modificatiion de l'URL pour quelle soit dynamique
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Sauvegarde dans la base de donnée
    sauce.save()
        // réponse au frontend
        .then(() => res.status(201).json({ message: 'Sauce bien enregistré !'}))
        .catch(error => res.status(400).json({ error}));
};


// Modification de la sauce
exports.updateSauce = (req, res, next) => {
    // Si image
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
        // sinon
     } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => resizeTo.status(400).json({ error}));
};

// Supression de sauce
exports.deleteSauce = (req, res, next) => {
    // Recherche de l'objet et supression de  l'image
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
         // extraction de l'url de la sauce puis split pour reprendre le deuxième élément qui est le nom du fichier   
        const filename = sauce.imageUrl.split('/images/')[1];
        // appel de unlink avec le nom du fichier pour le supprimer
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error}));

        });
    })
        .catch(error => res.status(500).json({ error }));
};

// Récupération d'une sauce avec l'id depuis la base de donnée MongoDB

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de toute les sauces

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Like ou Dislike d'une sauce

exports.likeDislike = (req, res, next) => {
    // userId du body
    let userId = req.body.userId
    // like du body
    let like = req.body.like
    // sauce id du body
    let sauceId = req.params.id

    if (like === 1) {
        // Si like
        Sauce.updateOne({
            _id: sauceId
        }, {
            // ajout du user id
            $push: {
                userLiked: userId
            },
            // incrémentation du compteur
            $inc: {
                likes: +1
            },
        })
        .then(() => res.status(200).json({
            message: 'Liked !'
        }))
        .catch((error) => res.status(400).json({
            error
        }))
    }

    if (like === -1) {
        // Si dislike
        Sauce.updateOne({
            _id: sauceId
        }, {
            // ajout userId
            $push: {
                usersDisliked: userId
            },
            $inc: {
                // incrementattion du compteur dislike
                dislikes: +1
            },
            }
        )
        .then(() => {
            res.status(200).json({
                message: 'Disliked'
            })
        })
        .catch((error) => res.status(400).json({
            error
        }))
    }
    if (like === 0) {
        Sauce.findOne({
            _id: sauceId
        })
        .then((sauce) => {
            if (sauce.userLiked.includes(userId)) {
                Sauce.updateOne({
                    _id: sauceId
                }, {
                    $pull: {
                        userLiked: userId
                    },
                    $inc: {
                        likes: -1
                    },
                })
                .then(() => res.status(200).json({
                    message: 'Disliked'
                }))
                .catch((error) => res.status(400).json({
                    error
                }))
            }
        })
        .catch((error) => res.status(404).json({
            error
        }))
    }
}