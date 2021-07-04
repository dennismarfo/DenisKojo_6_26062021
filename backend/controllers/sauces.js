const Sauce = require("../models/sauce");
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
      // On supprime l'id généré automatiquement et envoyé par le front-end.
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce bien enregistré !'}))
        .catch(error => res.status(400).json({ error}));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
     } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => resizeTo.status(400).json({ error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`ìmages/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error}));

        });
    })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.likeDislike = (req, res, next) => {
    let userId = req.body.userId
    let like = req.body.like
    let sauceId = req.params.id

    if (like === 1) {
        Sauce.updateOne({
            _id: sauceId
        }, {
            $push: {
                userLiked: userId
            },
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
        Sauce.updateOne({
            _id: sauceId
        }, {
            $push: {
                usersDisliked: userId
            },
            $inc: {
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