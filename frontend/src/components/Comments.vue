<template>
    <div class="commentSection">
        <div class="postComment">
            <!-- zone de texte pour le commentaire , boutton pour commenter -->
            <textarea class="comment" placeholder="Votre Commentaire" v-model="this.text" aria-label="Zone de texte commentaire"></textarea>
            <button class="submitComment" v-on:click="submitComment(postId)" aria-label="Boutton poster commentaire" title="Boutton poster commentaire"><span class= "comment_icon_button"><i class="fa-regular fa-comments"></i></span></button>
        </div>
        <!-- message d'erreur si le commentaire est vide -->
        <p class="msgError_comment" v-if="this.text == ''">{{msgError}}</p>
        <!-- affichage des commentaires -->
        <div v-for=" comment in comments" class="UsersComment">
            <div class="block_commenter_text">
                <!-- nom du commentateur -->
                <div class="commenter_name">
                    <h3>{{ comment.commenterPseudo }}</h3>
                </div>
                <!-- text du commentaire -->
                <div class="commenter_post">
                    <p>{{ comment.text }}</p>
                </div>
            </div>
            <!-- boutton pour supprimer ou modifier le commentaire si admin ou utilisateur qui a commenté -->
            <div class="delete_commenter">
                <button class="comment_button" v-if="auth(comment.commenterId) || admin()" v-on:click="deleteButton(postId, comment._id, comment.commenterId)" aria-label="Boutton supprimer commentaire" title="Boutton supprimer commentaire"><span style="font-size: 17px; color: white"><i class="fa-solid fa-trash"></i></span></button>
                <button class="comment_button" v-if="auth(comment.commenterId) || admin()" v-on:click="routeModifyComment(postId, comment._id, comment.text)" aria-label="Boutton modifier commentaire" title="Boutton modifier commentaire"><span style="font-size: 17px; color: white"><i class="fa-solid fa-arrows-spin"></i></span></button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
       postId: String,
       comments: []
    },
    data() {
        return {
            text: '',
            msgError: ''
        }     
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
        /* fonction pour commenter */
        submitComment(id) {
            /* message d'erreur si commentaire est vide */
            if (this.text == ' ') { this.msgError == 'Veuillez remplir le champ'}
            else if (this.text !== '') {
                const token = JSON.parse(localStorage.getItem('user'))
                const text = this.text
                const commenterId = JSON.parse(localStorage.getItem('user')).userId
                const username = JSON.parse(localStorage.getItem('user')).username
                axios.post(`http://localhost:3000/api/post/${id}/comment`, {
                    commenterId: commenterId,
                    commenterPseudo: username,
                    text: text
                }, { 
                headers: { 
                    'Authorization': `Bearer ${token.token}` 
                }}
            )
            /* on fait un emit pour pouvoir rechargé dynamiquement le contenu */
            .then(() => this.$emit('getPosts'))
            }
            else {
                this.msgError = 'Veuillez remplir le champ'
            }
        },
        /* fonction pour delete le commentaire */
        deleteButton(id, commentId, Idcommenter) {
            /* on récupère l'id du post, le commenterId, ainsi que l'id du commentaire */
            const commenterId = Idcommenter
            const comment = commentId
            const userId = JSON.parse(localStorage.getItem('user')).userId
            const token = JSON.parse(localStorage.getItem('user'))
            axios.delete(`http://localhost:3000/api/post/${id}/comment`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }, 
                data: {    
                commentId: comment,
                commenterId: commenterId,
                userId: userId
            }
            })
            /* on emit pour pouvoir rechargé dynamiquement le contenu */
            .then(() => this.$emit('getPosts'))
        },
        /* route pour modifier commentaire */
        routeModifyComment(id, commentId, commentText) {
            this.$router.push(`/modifyComment/${id}`)
            /* on crée un localStorage avec les data du commentaire pour pouvoir les gérer par la suite */
            const data = {
                commentId: commentId,
                commenterText: commentText
            }
            localStorage.setItem('comment', JSON.stringify(data))
        }
    }
       
}
</script>

<style>
.postComment {
    display: flex;
    align-content: center;
}

.comment {
    border-radius: 100px;
    width: 100%;
    padding: 10px;
    height: 20px;
    margin-right: 10px;
}

.block_commenter_text {
    background-color: #31333f;
    box-shadow: 5px 5px 15px 5px rgba(103, 103, 103, 0.36);
    border-radius: 5px;
    height: 80px;
    margin: 10px;
    padding-left: 10px;
    width: auto;
}

.UsersComment {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

.commenter_name {
    margin-top: -10px;
}

.delete_commenter {
    align-self: flex-end;
}

.submitComment {
   background-color: #4E5166;
   border: none;
   cursor: pointer;
}

.msgError_comment {
    color: #FD2D01;
}

.comment_button{
    background-color: #4E5166;
    border: none;
    cursor: pointer;
}

.comment_icon_button {
    font-size: 22px;
    color: white;
    transition: color 0.3s;
}

.comment_icon_button:hover {
    color: #FFD7D7;
    transition: color 0.3s;
}

@media (max-width: 380px) {
    .block_commenter_text {
        width: 100%;
        margin: 0px;
        margin-bottom: 5px
    }
}

</style>