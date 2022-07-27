const Post = require('../models/post')
const fs = require('fs')

exports.getAllPost = (req, res, next) => {
    Post.find()
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json( { error }));
  }

exports.createPost = (req, res, next) => {
    delete req.body._id;
    let post;
    if (req.file) {
      post = new Post ({
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,  
        likes: 0,
        usersLiked: [],
        usersComment: [] 
      })
    } else {
      post = new Post({
        ...JSON.parse(req.body.post),
        likes: 0,
        usersLiked: [],
        usersComment: []
      })
    }
    console.log(post)
    post.save()
    .then(() => res.status(201).json({ message : 'Post enregistré !'}))
    .catch(error => res.status(400).json({ error }));
  }

  exports.getOnePost = (req, res, next) => {
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

      if (JSON.stringify(req.body.adminId)) {
          if (post.imageUrl) { 
          const filename = post.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post supprimé'}))
    .catch(error => res.status(400).json({ error }))
        }) } 
          else {
          Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Post supprimé'}))
    .catch(error => res.status(400).json({ error }))
        }  
      } 
    /* if (post.userId !== req.auth.userId) {
        res.status(400).json({ error })
      }  */
    else if (post.userId == req.auth.userId) {
        if (post.imageUrl) { 
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Post supprimé'}))
  .catch(error => res.status(400).json({ error }))
      }) } 
        else {
        Post.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Post supprimé'}))
  .catch(error => res.status(400).json({ error }))
      } 
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
        if (post.userId !== req.auth.userId) {
          res.status(403).json('403: unauthorized request')
        } 
  const postFile = req.file ?
  {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...JSON.parse(req.body.post)};      
  Post
  .updateOne({ _id: req.params.id }, { ...postFile, _id: req.params.id })
  .then(() => res.status(200).json({message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }))
       }
  )  
}

exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then(
      (post) => {
          if (req.body.like == 1) {
              Post
              .updateOne(
                  { _id: req.params.id }, 
                  {$inc: {likes: +1}, 
                  $push: {usersLiked: req.body.userId}})
              .then(() => res.status(200).json({message: 'Objet Liké !'}))
              .catch(error => res.status(400).json({ error }))  
          } 
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
                    if (!post) {
                      res.status(404).json( "erreur" )
                    }  
                    if (req.body.commenterId !== req.auth.userId) {
                      res.status(403).json('403: unauthorized request')
                    }
              const theComment = post.usersComment.find((comment) => comment._id.equals(req.body.commentId))
              theComment.text = req.body.text;
              post.save((err) => {
                if (!err) return res.status(200).json({message: 'Commentaire modifié'});
                return res.status(500).send(err);
              })
                   }
              )  
            }
         

exports.deleteComment = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then((post) => {
        if (!post) {
          res.status(404).json({ error })
        }
        if (req.body.commenterId !== req.body.userId) {
          res.status(403).json('403: unauthorized request')
        } 
        Post.updateOne(
          { _id: req.params.id },
          { $pull: {
              usersComment: {
                _id: req.body.commentId
              }
          }})
          .then(() => res.status(200).json({message: 'Commentaire supprimé !'}))
          .catch(error => res.status(400).json({ error }))
      })} 