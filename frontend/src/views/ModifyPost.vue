<template>
    <div class="block_ModifyPost">
        <form @submit.prevent="PostModify" class="form_modify">
        <div class="photo_profil"></div>
        <div class="post_text">
            <textarea class="modify_text" placeholder="Modifie ton post ici" v-model="ModifyPost.postText"></textarea>
        </div>
        <div class="submit_photo" id="remove">
            <input type="file" name="images" @change="onFileSelected" ref="file" />
            <div v-if="ModifyPost.imageUrl" class="modify_image" id="child-remove"><img :src="ModifyPost.imageUrl" alt="image du post" class="img_ModifyPost"></div>
            <div v-if="data.file"><img :src="data.newImg.src" alt="image du post" class="img_ModifyPost"></div>
        </div>
        <button>Modifier</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
       return {
           ModifyPost: [],
           data: {
               file:'',
               newImg: ''
           }
       }
    },
    created() {
        this.GetOnePost(this.$route.params.id)
    },
    methods: {
        GetOnePost(id){
            const token = JSON.parse(localStorage.getItem('user'))
            axios.get(`http://localhost:3000/api/post/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            })
            .then((res) => {this.ModifyPost = res.data, console.log(res)})
            .catch(erreur => console.log(erreur))
        },

        onFileSelected() {
             this.data.file = this.$refs.file.files[0]; 
             let img = this.$refs.file.files[0]
             this.data.newImg = new Image(img.width, img.height)
             this.data.newImg.src = URL.createObjectURL(img)
             let remove = document.getElementById('child-remove')
             remove.remove() 
        },
        PostModify() {
            if (this.data.file !== '') {
                let formData = new FormData()
            let post = {
                postText: this.ModifyPost.postText,
            }
            formData.append('post', JSON.stringify(post))
            formData.append('image', this.data.file)
            const id = this.$route.params.id
            const token = JSON.parse(localStorage.getItem('user'))
            axios.put(`http://localhost:3000/api/post/${id}`, formData, 
                { headers: { 'Content-Type': 'multipart/form-data',
                             'Authorization': `Bearer ${token.token}` 
                              }})
                .then(() => this.$router.push("/home"))
            } else  {
                let formData = new FormData()
                let post = {
                 postText: this.ModifyPost.postText,
            }
            formData.append('post', JSON.stringify(post))
            const id = this.$route.params.id
            const token = JSON.parse(localStorage.getItem('user'))
            axios.put(`http://localhost:3000/api/post/${id}`, formData, 
                { headers: { 'Content-Type': 'multipart/form-data',
                             'Authorization': `Bearer ${token.token}` 
                              }})
                .then(() => this.$router.push("/home"))
            }
        } 
    }       
    }
</script>

<style>
.block_ModifyPost {
    display: flex;
    justify-content: center;
    height: auto;
    width: 100%
}

.form_modify {
    width:100%;
    display: flex;
    align-items: center;
    padding-left: 0px;
    padding-right: 0px;
}

.modify_text {
    width: 100%;
    height: 200px;
    align-self: center
}

.submit_photo {
    width: 90%;

}

.modify_image {
    padding-top: 10px;
}

.img_ModifyPost {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 5px 5px 10px 2px rgba(74, 74, 74, 0.36);
    margin-bottom: 5px;
    margin-top: 10px
}
</style>