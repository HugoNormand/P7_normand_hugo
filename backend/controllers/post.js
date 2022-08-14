const Post = require('../models/post')
const fs = require('fs')

exports.getAllPost = (req, res, next) => {
    /* on récupère les post et on affiche le plus récent en premier */
    Post.find().sort({ createdAt: -1 })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json( { error }));
  }

exports.createPost = (req, res, next) => {
    delete req.body._id;
    let post;
    /* si il y as une image à ajouter on récupère l'image récupéré sous formData */
    if (req.file) {
      post = new Post ({
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,  
        likes: 0,
        usersLiked: [],
        usersComment: [] 
      })
    } else {
      /* sinon on parse les informations reçu */
      post = new Post({
        ...JSON.parse(req.body.post),
        likes: 0,
        usersLiked: [],
        usersComment: []
      })
    }
    /* on sauvegarde le post */
    post.save()
    .then(() => res.status(201).json({ message : 'Post enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  }

exports.getOnePost = (req, res, next) => {
    /* on affiche un seul post grâce a son id présent dans l'URL */
    Post.findOne({ _id: req.params.id})
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({ error }));
  }

exports.deleteOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then((post) => {
      if (!post) {
        res.status(404).json({ error })
      }
      /* si le req.isAdmin est true ou que ke userId est égal au req.auth alors on donne accès pour pouvoir supprimer le post */
      if (req.isAdmin.isAdmin || post.userId == req.auth.userId) {
          if (post.imageUrl) { 
              const filename = post.imageUrl.split('/images/')[1];
              /* on utlise fs pour supprimer l'image du dossier image et supprimer ensuite le post */
              fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post supprimé'}))
                .catch(error => res.status(400).json({ error }))
        })} 
          else {
            /* si il n'ya pas d'image on supprime le post */
            Post.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Post supprimé'}))
            .catch(error => res.status(400).json({ error }))
        }  
      } 
     else {
        /* sinon erreur 403 */
        res.status(403).json('403: unauthorized request')
      }      
    } 
  )
  .catch(error => res.status(500).json({ error }))    
}

exports.modifyPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then((post) => {
        if (!post) {
          res.status(404).json({ error })
        }
        /* si le req.isAdmin est true alors on donne accès pour pouvoir supprimer le post */
        if (req.isAdmin.isAdmin == true || post.userId == req.auth.userId) {
          /* si il y'as une image on remplace l'imageUrl sinon on parse juste le body */
          const postFile = req.file ?
            {
                ...JSON.parse(req.body.post),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : {...JSON.parse(req.body.post)};  
                  Post
                  .updateOne({ _id: req.params.id }, { ...postFile, _id: req.params.id })
                  .then(() => res.status(200).json({message: 'Objet modifié !'}))
                  .catch(error => res.status(400).json({ error }))
        }  else {
          res.status(403).json('403: unauthorized request')
        }
       }
  )  
}

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then(
      (post) => {
          /* on envoi +1 a l'API si l'utilisateur like et on incrémente likes de +1 */
          /* on push l'id de l'utilisateur qui a liké */
          if (req.body.like == 1) {
              Post
              .updateOne(
                  { _id: req.params.id }, 
                  {$inc: {likes: +1}, 
                  $push: {usersLiked: req.body.userId}})
              .then(() => res.status(200).json({message: 'Objet Liké !'}))
              .catch(error => res.status(400).json({ error }))  
          } 
          /* si l'utilisateur enlève son like, in incrémente de -1 les likes et on pull son id du tableau */
          if (req.body.like == 0) {
              if (post.usersLiked.find(userId => userId == req.body.userId)) {
                  Post
                  .updateOne({ _id: req.params.id }, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                  .then(() => res.status(200).json({message: 'Objet like Annuler !'}))
                  .catch(error => res.status(400).json({ error })) 
              }
          }
      })} 

exports.commentPost = (req, res, next) => {
        Post.findOne({ _id: req.params.id }).then(
            (post) => {
                    /* on push dans la partie commentaire les infos reçu sur le commentateur */
                    Post
                    .updateOne(
                        { _id: req.params.id }, 
                        { $push: {
                          usersComment : {
                            commenterId: req.body.commenterId,
                            commenterPseudo: req.body.commenterPseudo,
                            text: req.body.text,
                          } 
                        }})
                    .then(() => res.status(200).json({message: 'Commentaire ajouté !'}))
                    .catch(error => res.status(400).json({ error }))  
            })} 

exports.modifyComment = (req, res, next) => {
        Post.findOne({ _id: req.params.id })
        .then((post) => {
          /* on trouve le commentaire à modifié  */
          const theComment = post.usersComment.find((comment) => comment._id.equals(req.body.commentId))
                    if (!post) {
                      res.status(404).json( "erreur" )
                    }  
                    /* autorisation à l'admin de modifier */
                    if (req.isAdmin.isAdmin || req.body.commenterId == theComment.commenterId) {
                        /* le texte du commentaire devient celui reçu */
                        theComment.text = req.body.text;
                        post.save((err) => {
                          if (!err) return res.status(200).json({message: 'Commentaire modifié'});
                          return res.status(500).send(err);
                        })
                    }
                    else {
                      res.status(403).json('403: unauthorized request')
                    }
                }
              )  
            }
         
exports.deleteComment = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then((post) => {
        if (!post) {
          res.status(404).json({ error })
        }
        /* on autorise l'admin à supprimer le commentaire */
        if (req.isAdmin.isAdmin || req.body.commenterId == req.body.userId) {
          /* on pull le commentaire des usersComment */
          Post.updateOne(
            { _id: req.params.id },
            { $pull: {
                usersComment: {
                  _id: req.body.commentId
                }
            }})
            .then(() => res.status(200).json({message: 'Commentaire supprimé !'}))
            .catch(error => res.status(400).json({ error }))
        }
        /* on autorise le createur du commentaire à supprimer */
        else {
          res.status(403).json('403: unauthorized request')
        }
      })} 