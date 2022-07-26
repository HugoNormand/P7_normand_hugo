<template>
    <div class="block_modify">
        <h3 class="comment_title_modify">Modifie ton commentaire</h3>
        <form v-on:submit.prevent class="form_comment_modify">
            <textarea v-model="text" class="comment_text_modify">{{this.text}}</textarea>
            <button v-on:click.preventDefault="ModifyPost()">Modifier</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            text: JSON.parse(localStorage.getItem('comment')).commenterText,
        }      
    },
    methods: {
        ModifyPost() {
            const id = this.$route.params.id
            const commentId = JSON.parse(localStorage.getItem('comment')).commentId
            const commentText = this.text
            const commenterId = JSON.parse(localStorage.getItem('user')).userId
            const token = JSON.parse(localStorage.getItem('user'))
            axios.put(`http://localhost:3000/api/post/${id}/comment`, {
                commenterId: commenterId,
                commentId: commentId,
                text: commentText
            } , 
                { headers: { 
                             'Authorization': `Bearer ${token.token}` 
                              }})
                .then(() => this.$router.push('/home'))
        }
    }
}
</script>

<style>
.block_modify {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center
}

.comment_text_modify {
    width: 80%;
    height: 200px;
    margin-bottom: 50px;
}

.form_comment_modify {
    width: 50%;
    height: 300px;
    display: flex;
    align-items: center;
    padding-left: 0px;
    padding-right: 0px;
}
</style>