const bcrypt = require('bcrypt')
const user = require('../models/user')
const jwt = require('jsonwebtoken')


exports.signup = (req, res, next) => {
    user.findOne({ username : req.body.username })
    .then((result) => {
        console.log("result is: ", result)
        if(result) {
            throw "username already exist"
        } else {
            bcrypt.hash(req.body.password, 10)
        .then(hash => {
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
            if (!currentUser) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'})
            }
            bcrypt.compare(req.body.password, currentUser.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json( { error : 'Mot de passe incorrect !'})
                    }
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
    user.findOne({ _id: req.params.id})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyProfilPic = (req, res, next) => {
    user.findOne({ _id: req.params.id })
    .then((user) => {
        const imgProfil = 
            {
                profilImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            user
            .updateOne({ _id: req.params.id }, { ...imgProfil, _id: req.params.id })
            .then(() => res.status(200).json({message: 'Photo modifié!'}))
            .catch(error => res.status(400).json({ error }))    
    })
}