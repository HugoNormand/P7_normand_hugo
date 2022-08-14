<template>
    <form class="block_CreatePost">
     <div class="post_text">
          <!-- photo de profil de l'utilisateur, zone de texte pour post -->
          <img class="profilPic_createPost" v-bind:src="this.profil.profilImage" alt="Photo de profil utilisateur">
          <textarea class="text_style" placeholder="Quoi de neuf ?" v-model="postData.postText" aria-label="Zone de texte post"></textarea>
          <div class="submit_photo">
            <!-- icon choisir image , icon poster -->  
            <span class="icon_choose_file" aria-label="Boutton selection de fichier"><i class="fa-solid fa-photo-film"></i>
            <input class="input_img_post" type="file" name="images" @change="onFileSelected" ref="file" id="file_id" aria-label="Boutton selection de fichier" accept="image/*"/>
            </span>  
            <button class="send_button_create_post" aria-label="Boutton poster" title="Post button" v-on:click.prevent="createPost()"><span class="icon_send"><i class="fa-regular fa-paper-plane"></i></span></button>
          </div>
      </div>
      <!-- affichage de l'image si l'utilisateur poste une image -->
      <div v-if="postData.file" class="image_apparition">
           <!-- boutton pour supprimer image , image choisi -->
           <button class= "remove_img_createPost" v-if="postData.file" v-on:click="removeFileSelect()"><span class="icon_delete_img"><i class="fa-solid fa-circle-xmark"></i></span></button>
           <img :src="postData.newImg.src" :alt="postData.file.name" class="img_createPost">
      </div>
      <!-- message d'erreur si le post est vide -->
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
           }, 
           profil : []    
       }
    },
    created() {
        this.userInfo()
    },

    methods: {
        /* on crée un URL pour la nouvelle image de profil, pour pouvoir l'afficher */
        onFileSelected() {
             this.postData.file = this.$refs.file.files[0];
             let img = this.$refs.file.files[0]
             this.postData.newImg = new Image(img.width, img.height)
             this.postData.newImg.src = URL.createObjectURL(img)
        },
        /* fonction qui supprime l'image sélectionnée */
        removeFileSelect() {
             const id = document.getElementById('file_id')
             id.remove(id.value)
        },
        /* fonction création de post */
        createPost() {
            /* si le texte est vide on renvoi un message d'erreur */
            if (this.postData.postText == ' ') {
                this.postData.msgError = 'Veuillez renseigner un des champs'
            }    
            else if (this.postData.postText || this.postData.file !== '') {
                /* on envoie les données sous formData à l'API */
                let formData = new FormData()
                let post = {
                    postText: this.postData.postText,
                    userId: JSON.parse(localStorage.getItem('user')).userId,
                    username: JSON.parse(localStorage.getItem('user')).username,
                    profilImage: this.profil.profilImage
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
        /* on récupère les infos de l'utilisateur pour afficher sa photo de profil */
        userInfo() {
            const id = JSON.parse(localStorage.getItem('user')).userId
            const token = JSON.parse(localStorage.getItem('user'))
            axios.get(`http://localhost:3000/api/auth/userInfo/${id}`,
            {
                    headers: {
                        'Authorization': `Bearer ${token.token}`
                    }})
            .then((res) => {this.profil = res.data})
        }
    }       
    }
</script>

<style>
.block_CreatePost {
    margin: 20px;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    align-self: center;
    align-items: center;
    background-color: #4E5166;
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.36);
    border: solid #4E5166;
    border-radius: 5px;
    width: 60%;
}

.post_text {
    width: 95%;
    display: flex;
    margin-bottom: 30px;
    margin-right: -40px;
    margin-top: 8px;
}

.profilPic_createPost{
    width: 40px;
    height: 40px;
    border-radius: 200px;
    border: 2px solid #FFD7D7;
    margin-top: 8px;
    margin-right: 10px;
    margin-left: -10px;
}

.submit_photo {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin-top: 5px;
    width: 20%;
}

.text_style {
    margin-top: 10px;
    border: solid #4E5166;
    border-radius: 5px;
    width: 100%;
    height: 100px;
}

.image_apparition {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 300px;
    margin-bottom: 70px;
}

.img_createPost {
    width: 90%;
    height: 300px;
    object-fit: fill;
    border-radius: 5px;
    box-shadow: 5px 5px 15px 5px rgba(0,0,0,0.36);
}

.send_button_create_post {
    background-color: #4E5166;
    border: none;
    cursor: pointer;
    align-self: flex-start;
}

.icon_send {
    font-size: 25px;
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
    height: 50px;
    opacity: 0;
    cursor: pointer;
    position: relative;
    right: 35px;
    bottom: 20px;
}

.icon_choose_file {
    font-size: 25px;
    display: flex;
    height: 40px;
    color: white;
    transition: color 0.3s;
    margin-left: 5px;
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

@media (max-width: 690px) {
    .block_CreatePost{
        width: 90%
    }
}

@media (min-width:690px) and (max-width: 880px) {
    .block_CreatePost{
        width: 80%
    }
}

@media (max-width: 400px) {
    .profilPic_createPost {
        display: none;
    }
}

@media (max-width: 280px) {
    .icon_choose_file {
        font-size: 20px;
    }
    .icon_send {
        font-size: 20px;
    }
}
</style>