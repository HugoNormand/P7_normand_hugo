<template>
   <!-- affichage nombre de j'aime ainsi que l'icon coeur -->
   <div class="usersLike_length">
        <span v-if="usersLiked.length > 0" class="icon_heart_users" aria-label="Icon coeur"><i class="fa-solid fa-heart"></i></span>
        <p v-if="usersLiked.length > 0">{{usersLiked.length}}</p>
   </div>
   <!-- boutton j'aime  -->
   <div class="button_like">
       <div class="like_block">
            <button class="LikeButton"  v-if="!usersLiked.find(e => e == userId)" v-on:click="LikeUpdate(postId)" aria-label="Boutton Like" title="Boutton Like"><span class="thumbs_up_like"><i class="fa-regular fa-thumbs-up"></i></span></button>
            <button class="LikeButton"  v-else  v-on:click="DislikeUpdate(postId)" aria-label="Boutton Dislike" title="Boutton Dislike"><span style="font-size: 20px; color: #FFD7D7;"><i class="fa-regular fa-thumbs-up"></i></span></button>
            <p class="Like_text">J'aime</p>
       </div>
        <!-- nombres de commentaires sur le post -->
        <div class="commentaire_length">
            <p v-if="comment.length == 1">{{comment.length + ' ' + 'commentaire'}}</p> 
            <p v-if="comment.length > 1">{{comment.length + ' ' + 'commentaires'}}</p> 
        </div> 
   </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        postId: String,
        usersLiked: { type: [String] },
        comment: []
    },
    data() {
        return {
            like: 0,
            buttonIsLike: true,
            buttonIsDislike: false,
            userId: JSON.parse(localStorage.getItem('user')).userId
        }     
    },
    methods: {
        /* fonction like qu'on envoi à l'API quand l'utilisateur like */
        LikeUpdate(id) {
            this.like = 1
            this.buttonIsDislike = true
            let body = {
                like: +1,
                userId: JSON.parse(localStorage.getItem('user')).userId,
            }
            const token = JSON.parse(localStorage.getItem('user'))
            axios.post(`http://localhost:3000/api/post/${id}/like`, body,
            { headers: { 'Authorization': `Bearer ${token.token}`}})
            .then(()=> this.$emit("getPosts"))
        },
        /* fonction like qu'on envoi à l'API quand l'utilisateur Dislike */
        DislikeUpdate(id) {
            this.like = 0
            this.buttonIsDislike = false,
            this.buttonIsLike = true
            let body = {
                like: 0,
                userId: JSON.parse(localStorage.getItem('user')).userId,
            }
            const token = JSON.parse(localStorage.getItem('user'))
            axios.post(`http://localhost:3000/api/post/${id}/like`, body,
            { headers: { 'Authorization': `Bearer ${token.token}`}})
            .then(()=> this.$emit("getPosts"))
        }
    }      
}
</script>

<style>
.button_like {
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-top: solid #4E5166;
    margin-top: 10px;
    border-top:  solid #FFD7D7;
}

.LikeButton {
    height: 30px;
    width: 20px;
    align-self: center;
    margin-right: 15px;
    background-color: #4E5166;
    border: none;
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
}

.like_block {
    display: flex;
    margin: 5px;
    height: 30px;
    padding: 5px;
    transition: box-shadow 0.3s;
    border-radius: 5px;
}


.Like_text {
    align-self: center;
}

.commentaire_length{
    align-self: flex-end;
}

.thumbs_up_like {
    font-size: 20px;
    color: white;
    transition: color 0.3s;
}

.thumbs_up_like:hover {
    color: #FFD7D7;
    transition: color 0.3s;
}

.usersLike_length {
    display: flex;
}

.icon_heart_users {
    align-self: center;
    margin-right: 5px;
    color: #FFD7D7;
}
</style>