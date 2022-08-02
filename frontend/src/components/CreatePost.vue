<template>
    <form @submit.prevent="createPost" class="block_CreatePost">
      <div class="photo_profil"></div>
      <div class="post_text">
          <textarea class="text_style" placeholder="Quoi de neuf ?" v-model="postData.postText"></textarea>
      </div>
      <div class="submit_photo">
          <input type="file" name="images" @change="onFileSelected" ref="file" id="file_id"/>
          <button v-if="postData.file" v-on:click="removeFileSelect">Supprimer l'image</button>
      </div>
      <div v-if="postData.file" class="image_apparition"><img :src="postData.newImg.src" :alt="postData.file.name" class="img_createPost"></div>
      <button>Publier</button>
      <p class="msg_error_post" v-if="this.postData.msgError !== ''">{{postData.msgError }}</p>
    </form>
</template>

<script>
import axios from 'axios'
export default {
    data() {
       return {
           postData: {
               postText: '',
               file: '',
               newImg: '',
               msgError: ''
           }     
       }
    },
    methods: {
        onFileSelected() {
             this.postData.file = this.$refs.file.files[0];
             let img = this.$refs.file.files[0]
             this.postData.newImg = new Image(img.width, img.height)
             this.postData.newImg.src = URL.createObjectURL(img)
        },

        removeFileSelect() {
             const id = document.getElementById('file_id')
             id.remove(id.value)
        },

        createPost() {
            if (this.postData.postText || this.postData.file !== '') {
                let formData = new FormData()
                let post = {
                    postText: this.postData.postText,
                    userId: JSON.parse(localStorage.getItem('user')).userId,
                    username: JSON.parse(localStorage.getItem('user')).username
                }
            formData.append('post', JSON.stringify(post))
            formData.append('image', this.postData.file)
            const token = JSON.parse(localStorage.getItem('user'))
            axios.post("http://localhost:3000/api/post", formData, 
                { headers: { 'Content-Type': 'multipart/form-data',
                             'Authorization': `Bearer ${token.token}` 
                              }})
                .then(()=> location.reload())
            } else {
                this.postData.msgError = 'Veuillez renseigner un des champs'
            }    
        },
    }       
    }
</script>

<style>
.block_CreatePost {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    background-color: #4E5166;
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.36);
    border: solid #4E5166;
    border-radius: 5px;
}

.post_text {
    width: 80%;
}

.text_style {
    margin-top: 10px;
    border: solid #4E5166;
    border-radius: 5px;
    width: 100%;
    height: 100px;
}

.image_apparition {
    padding-top: 10px;
    width: 100%;
}

.img_createPost {
    width: 100%;
    object-fit: contain;
}

.msg_error_post{
    color: #FD2D01;
}

</style>