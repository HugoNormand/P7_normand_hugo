<template>
    <form @submit.prevent="createPost" class="block_CreatePost">
      <div class="photo_profil"></div>
      <div class="post_text">
          <textarea class="text_style" placeholder="Quoi de neuf ?" v-model="postData.postText"></textarea>
          <button class="send_button_create_post"><span class="icon_send" style="font-size: 25px"><i class="fa-regular fa-paper-plane"></i></span></button>
      </div>
      <div class="submit_photo">
          <span class="icon_choose_file" style="font-size: 25px"><i class="fa-solid fa-photo-film"></i>
          <input class="input_img_post" type="file" name="images" @change="onFileSelected" ref="file" id="file_id"/>
          </span>  
      </div>
      <div v-if="postData.file" class="image_apparition">
           <button class= "remove_img_createPost" v-if="postData.file" v-on:click="removeFileSelect"><span class="icon_delete_img"><i class="fa-solid fa-circle-xmark"></i></span></button>
           <img :src="postData.newImg.src" :alt="postData.file.name" class="img_createPost">
      </div>
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
    display: flex;
}

.text_style {
    margin-top: 10px;
    border: solid #4E5166;
    border-radius: 5px;
    width: 100%;
    height: 100px;
}

.submit_photo {
    margin-top: 5px;
}

.image_apparition {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 300px;
    margin-bottom: 40px;
}

.img_createPost {
    width: 100%;
    height: 300px;
    object-fit: fill;
    border-radius: 5px;
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.36);
}

.send_button_create_post {
    background-color: #4E5166;
    border: none;
    cursor: pointer;
    align-self: flex-end;
}

.icon_send {
    color: white;
    transition: color 0.3s;
}

.icon_send:hover {
    cursor: pointer;
    color: #FFD7D7;   
    transition: color 0.3s; 
}

.msg_error_post{
    color: #FD2D01;
}

.input_img_post{
    width: 100px;
    height: 50px;
    opacity: 0;
    cursor: pointer;
    position: relative;
    right: 60px;
    bottom: 20px;
}

.icon_choose_file {
    position: relative;
    left: 45px;
    color: white;
    transition: color 0.3s;
}

.icon_choose_file:hover {
    cursor: pointer;
    color: #FFD7D7;   
    transition: color 0.3s; 
}

.remove_img_createPost {
    width: 20%;
    align-self: flex-end;
    background-color: #4E5166;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
}

.icon_delete_img {
    font-size: 25px;
    color: white;
    transition: color 0.3s;
}

.icon_delete_img:hover {
    color: #FD2D01;
    transition: color 0.3s;
}
</style>