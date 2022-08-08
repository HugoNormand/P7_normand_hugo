<template>
    <div>
        <img id='img_profilPic' v-bind:src="this.profil.profilImage">
    </div>
    <div v-if="data.file">
        <img :src="data.newImg.src" alt="image du post" class="img_ModifyPost">
    </div>
    <div>
        <input type="file" @change="onFileSelected()" ref="file">
    </div>
    <div>
        <button v-on:click="modifyPic()">modifier</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
             profil: [],
             data: {
               file:'',
               newImg: ''
           }
        }   
    },
    created() {
        this.userInfo()
    },
    methods: {
        userInfo() {
            const id = JSON.parse(localStorage.getItem('user')).userId
            axios.get(`http://localhost:3000/api/auth/userInfo/${id}`)
            .then((res) => {this.profil = res.data})
        },
        onFileSelected() {
             this.data.file = this.$refs.file.files[0]; 
             let img = this.$refs.file.files[0]
             this.data.newImg = new Image(img.width, img.height)
             this.data.newImg.src = URL.createObjectURL(img)
             /* quand l'utilisateur à choisi une nouvelle image, on supprime l'ancienne du visuel */
             const id = document.getElementById('img_profilPic')
             id.remove(id.value)
        },
        modifyPic() {
            let formData = new FormData()
            /* on envoie les données sous format formData */
            formData.append('image', this.data.file)
            const id = this.$route.params.id
            const token = JSON.parse(localStorage.getItem('user'))
            /* méthode put pour modifier le post */
            axios.put(`http://localhost:3000/api/auth/modifyProfil/${id}`, formData, 
                { headers: { 'Content-Type': 'multipart/form-data',
                             'Authorization': `Bearer ${token.token}` 
                              }})
                .then(() => this.$router.push("/home"))
            } 
        }
    }       
</script>

<style>
</style>