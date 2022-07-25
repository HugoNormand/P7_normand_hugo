<template>
  <div class="commentSection">
      <div class="postComment">
          <textarea class="comment" placeholder="Votre Commentaire" v-model="this.text"></textarea>
          <button class="submitComment" v-on:click="submitComment(postId)">Commenter</button>
      </div>
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
              <button v-if="auth(comments.commenterId)" v-on:click="deleteButton(postId, comments._id, comments.commenterId)">Supprimer</button>
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
            text: ''
        }     
    },
    methods: {
        submitComment(id) {
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
            ).then(() => location.reload())
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
            }).then(() => location.reload())
        },
        auth(postUserId){
            const userId = JSON.parse(localStorage.getItem('user')).userId
            if (postUserId == userId) {
                return true
            } else {
                return false
            }
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
    border: solid #4E5166;
    height: 80px;
    margin: 10px;
    padding-left: 10px;
}

.UsersComment {
    display: flex;
    flex-direction: column;
}

.commenter_name {
    margin-top: -10px;
}

.delete_commenter {
    align-self: flex-end;
}
</style>