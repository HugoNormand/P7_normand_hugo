<template>
    <div v-for="post in posts" class="block_post" >
        <div class="block_right">
            <!-- block profil avec username et photo de profil ainsi que les bouttons supprimer et modifier -->    
            <div class="block_profil">
                <!-- partie username , photo de profil -->
                <div class="img_profil_username">
                   <img class="profil_img_user" v-bind:src="post.profilImage" alt="Photo de profil du posteur">
                   <h3>{{post.username}}</h3> 
                </div>
                <!-- partie bouttons, supprimer et modifier -->
                <div>
                    <button class="delete_button" v-if="auth(post.userId) || admin()" v-on:click="deletePosts(post._id)" aria-label="Boutton supprimer post" title="Boutton supprimer post"><span style="font-size: 20px; color: white"><i class="fa-solid fa-trash"></i></span></button>
                    <button class="modify_button" v-if="auth(post.userId) || admin()" v-on:click="routeModifyPost(post._id)" aria-label="Boutton modifier post" title="Boutton modifier post"><span style="font-size: 20px; color: white"><i class="fa-solid fa-arrows-spin"></i></span></button>
                </div>
            </div>
            <div class="block_texte">
                <p>{{post.postText}}</p>
            </div>
        </div>
        <!-- block image du post si image  -->
        <div class="block_image" v-if="post.imageUrl">
             <img class="image_post" v-bind:src="post.imageUrl" alt="Image du post">
        </div> 
        <!-- composant Likes et Comments -->
        <Likes :postId="post._id" :usersLiked="post.usersLiked" :comment="post.usersComment" @getPosts="updatePosts"/>
        <Comments :postId="post._id" :comment="post.usersComment" @getPosts="updatePosts"/>
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
           posts: [],
           profil: []
        } 
    },

    created() {
        this.updatePosts()
    },

    methods: {
        /* fonction auth pour afficher les bouttons que si l'utilisateur est le créateur du post */
        auth(postUserId){
            /* vérification avec le localStorage */
            const userId = JSON.parse(localStorage.getItem('user')).userId
            if (postUserId == userId) {
                return true
            } else {
                return false
            }
        },
        /* vérification pour savoir si l'utilisateur est l'admin et ainsi pouvoir supprimer ou modifier les posts */
        admin() {
            /* vérification avec le localstorage admin */
            if (localStorage.getItem('admin')) {
               return true
            }
        },
        /* affichage des posts avec GET */
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
        /* fonction pour supprimer le post */
        deletePosts(id){
            const token = JSON.parse(localStorage.getItem('user'))
            axios.delete("http://localhost:3000/api/post/"+id, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            })
            .then(() => this.updatePosts())
        },
        /* route qui mène a la page modifyPost avec l'id du post dans l'URL */
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
    border-radius: 5px;
    background-color: #4E5166;
    opacity: 0.9;
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.36);
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

.img_profil_username {
    display: flex;
}

.profil_img_user{
    width: 40px;
    border-radius: 300px;
    height: 40px;
    align-self: center;
    margin-right: 8px;
    object-fit: fill;
}

.delete_button {
    height: 40px;
    width: 30px;
    background-color: #4E5166;
    border: none;
    cursor: pointer;
}

.modify_button{
    height: 40px;
    width: 30px;
    background-color: #4E5166;
    border: none;
    cursor: pointer;
    margin-left: 8px;
}

.block_image {
    align-self: center;
    height: auto;
    width: 100%;
    height: 300px;  
}

.image_post {
    width: 100%;
    height: 300px;
    object-fit: contain;
    border-radius: 5px;
    box-shadow: 5px 5px 10px 2px rgba(74, 74, 74, 0.36);
}

.button_like {
    align-self: flex-start;
}

.block_texte {
    font-size: 25px;
}

</style>