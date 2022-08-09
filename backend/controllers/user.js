const bcrypt = require('bcrypt')
const user = require('../models/user')
const jwt = require('jsonwebtoken')


exports.signup = (req, res, next) => {
    user.findOne({ email : req.body.email })
    .then((result) => {
        /* si l'email existe déjà on renvoi un message d'erreur */
        if(result) {
            throw "email already exist"
        } else {
            /* on hash le mot de passe pour la sécurité */
            bcrypt.hash(req.body.password, 10)
        .then(hash => {
            /* on crée un nouveau user avec ses informations reçues */
            const newUser = new user({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                isAdmin: req.body.isAdmin ? req.body.isAdmin : false
            });
            newUser.save()
                .then(() => res.status(201).json( { message: 'Utilisateur crée' } ))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
        }
    })
        .catch(error => {
            res.status(500).json({error: error})
        })
};

exports.login = (req, res, next) => {
    user.findOne({ email : req.body.email })
        .then(currentUser => {
            /* si l'utilisateur n'est pas trouvé on renvoi une erreur */
            if (!currentUser) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'})
            }
            /* on compare le mot de passe rentré grâce a bcrypt */
            bcrypt.compare(req.body.password, currentUser.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json( { error : 'Mot de passe incorrect !'})
                    }
                    /* on lui crée un token pour l'autorisation d'accès */
                    res.status(200).json({
                        userId: currentUser._id,
                        username: currentUser.username,
                        token: jwt.sign(
                            { userId: currentUser._id,
                              isAdmin: currentUser.isAdmin
                            },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

exports.getInfo = (req, res, next) => {
    /* méthode pour récupérer les infos de l'utilisateur */
    user.findOne({ _id: req.params.id})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyProfilPic = (req, res, next) => {
    user.findOne({ _id: req.params.id })
    .then((user) => {
        /* on modifie la photo de profil par default par la photo de profil reçu */
        const imgProfil = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        user.profilImage =  imgProfil
        user.save((err) => {
            if (!err) return res.status(200).json({message: 'Photo modifié'});
            return res.status(500).send(err);
          })
    })
    .catch(error => res.status(404).json({ error }))
}