<template>
    <div v-for="post in posts" class="block_post" >
        <div class="block_profil_photo">
            
        </div>
        <div class="block_right">
            <div class="block_profil">
                <h3>{{post.username}}</h3>
                <div>
                    <button class="delete_button" v-if="auth(post.userId)" v-on:click="deletePosts(post._id)">Supprimer</button>
                    <button v-if="auth(post.userId)" v-on:click="routeModifyPost(post._id)">Modifier</button>
                </div>
            </div>
            <div class="block_texte">
                <p>{{post.postText}}</p>
            </div>
        </div>
            <div class="block_image" v-if="post.imageUrl">
                <img class="image_post" v-bind:src="post.imageUrl">
            </div>
        
        <Likes :postId="post._id" :usersLiked="post.usersLiked"/>
        <Comments :postId="post._id" :comment="post.usersComment"/>
    </div>
</template>

<script>
import axios from 'axios'
import Likes from '../components/Likes.vue'
import Comments from '../components/Comments.vue'
export default {
    components: {
        Likes,
        Comments,
    },

    data() {
       return {
           posts: [] 
       } 
    },

    created() {
        this.updatePosts()
    },

    methods: {

        auth(postUserId){
            const userId = JSON.parse(localStorage.getItem('user')).userId
            if (postUserId == userId) {
                return true
            } else {
                return false
            }
        },

        updatePosts(){
            const token = JSON.parse(localStorage.getItem('user'))
            axios.get("http://localhost:3000/api/post", {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            })
            .then((res) => {this.posts = res.data})
            .catch(erreur => console.log(erreur))
        },

        deletePosts(id){
            const token = JSON.parse(localStorage.getItem('user'))
            axios.delete("http://localhost:3000/api/post/"+id, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            }).then(() => this.updatePosts())
        },

        routeModifyPost(id) {
            this.$router.push(`/modifyPost/${id}`)
        }
    }
}
</script>

<style>
.block_post {
    display: flex;
    flex-direction: column;
    border: solid #4E5166;
    background-color: #FFD7D7;
    padding: 20px;
    margin: 20px;
    width: 80%;
    align-self: center;
}

.block_profil {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.delete_button {
    height: 30px;
    width: 100px;
}

.block_image {
    align-self: center;
}

img {
    object-fit: contain;
    width: 400px;
    height: 300px
}

.button_like {
    align-self: flex-start;
}

</style>