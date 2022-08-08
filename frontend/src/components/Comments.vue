<template>
  <div class="commentSection">
      <div class="postComment">
          <textarea class="comment" placeholder="Votre Commentaire" v-model="this.text" aria-label="Zone de texte commentaire"></textarea>
          <button class="submitComment" v-on:click="submitComment(postId)" aria-label="Boutton poster commentaire" title="Boutton poster commentaire"><span class= "comment_icon_button"><i class="fa-regular fa-comments"></i></span></button>
      </div>
      <p class="msgError_comment" v-if="this.text == ''">{{msgError}}</p>
      <div v-for=" comments in comment" class="UsersComment" >
          <div class="imageProfilCommenter">  

          </div>
          <div class="block_commenter_text">
              <div class="commenter_name">
                  <h3>{{ comments.commenterPseudo }}</h3>
              </div>
              <div class="commenter_post">
                  <p>{{ comments.text }}</p>
              </div>
          </div>
          <div class="delete_commenter">
              <button class="comment_button" v-if="auth(comments.commenterId) || admin()" v-on:click="deleteButton(postId, comments._id, comments.commenterId)" aria-label="Boutton supprimer commentaire" title="Boutton supprimer commentaire"><span style="font-size: 17px; color: white"><i class="fa-solid fa-trash"></i></span></button>
              <button class="comment_button" v-if="auth(comments.commenterId) || admin()" v-on:click="routeModifyComment(postId, comments._id, comments.text)" aria-label="Boutton modifier commentaire" title="Boutton modifier commentaire"><span style="font-size: 17px; color: white"><i class="fa-solid fa-arrows-spin"></i></span></button>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    props: {
       postId: String,
       comment: []
    },
    data() {
        return {
            text: '',
            msgError: ''
        }     
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

        admin() {
           if (localStorage.getItem('admin')) {
               return true
           }
        },

        submitComment(id) {
            if (this.text !== '') {
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
            .then(() => this.$emit('getPosts'))
            }
            else {
                this.msgError = 'Veuillez remplir le champ'
            }
        },
        
        deleteButton(id, commentId, Idcommenter) {
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
            .then(() => this.$emit('getPosts'))
        },

        routeModifyComment(id, commentId, commentText) {
            this.$router.push(`/modifyComment/${id}`)
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
</style>