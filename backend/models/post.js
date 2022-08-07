const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, require: true },
    username: { type: String, require: true},
    postText:{ type: String, require: true },
    imageUrl: { type: String },
    profilImage: { type: String },
    likes: { type: Number },
    usersLiked: [{ type: String, ref: 'userId', require: true }], 
    usersComment: [{
        commenterId: { type: String },
        commenterPseudo: { type: String },
        text: { type: String }
     }]    
})

module.exports = mongoose.model('Post', postSchema)