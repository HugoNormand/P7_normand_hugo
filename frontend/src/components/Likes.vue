<template>
   <div class="button_like">
        <button class="LikeButton"  v-if="!usersLiked.find(e => e == userId)" v-on:click="LikeUpdate(postId)">Like</button>
        <button class="LikeButton"  v-else  v-on:click="DislikeUpdate(postId)">DisLike</button>
        <p>{{usersLiked.length}}</p>
   </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
        postId: String,
        usersLiked: { type: [String] },
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
        LikeUpdate(id) {
            this.like = 1
            console.log(this.like)
            this.buttonIsDislike = true
            let body = {
                like: +1,
                userId: JSON.parse(localStorage.getItem('user')).userId,
            }
            const token = JSON.parse(localStorage.getItem('user'))
            axios.post(`http://localhost:3000/api/post/${id}/like`, body,
            {   headers: 
                { 'Authorization': `Bearer ${token.token}`}})
                .then(()=> location.reload())
        },

        DislikeUpdate(id) {
            this.like = 0
            console.log(this.like)
            this.buttonIsDislike = false,
            this.buttonIsLike = true
            let body = {
                like: 0,
                userId: JSON.parse(localStorage.getItem('user')).userId,
            }
            const token = JSON.parse(localStorage.getItem('user'))
            axios.post(`http://localhost:3000/api/post/${id}/like`, body,
            {   headers: 
                { 'Authorization': `Bearer ${token.token}`}})
                .then(()=> location.reload())
        }
    }
       
}
</script>

<style>
.button_like {
    display: flex;
    width: 100%;
    border-top: solid #4E5166;
    margin-top: 10px;
}

.LikeButton {
    height: 30px;
    width: 100px;
    align-self: center;
    margin-right: 10px;
}
</style>