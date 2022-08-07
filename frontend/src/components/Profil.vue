<template>
    <div class="block_header_profil_name">
        <div class="block_header_profil_pic">
            <img class="header_profil_pic" v-bind:src="this.profil.profilImage" alt="">
        </div>
        <div class="block_headerProfil">
            <h2 class="profilName_profil">{{ this.profilName }}</h2>
            <button class="buttonLogout" v-on:click="logOut()"><span style="font-size: 20px; color: #4E5166"><i class="fa-solid fa-right-from-bracket"></i></span></button> 
        </div>  
    </div>
      
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            profilName: JSON.parse(localStorage.getItem('user')).username,
            profil: []
        }
    },

    created() {
        this.userInfo()
    },

    methods: {
        logOut(){
            localStorage.clear();
            this.$router.push("/login")
        },

         userInfo() {
            const id = JSON.parse(localStorage.getItem('user')).userId
            axios.get(`http://localhost:3000/api/auth/userInfo/${id}`)
            .then((res) => {this.profil = res.data})
        }
    }
}
</script>

<style>

.block_header_profil_name{
    display: flex;
    justify-content: space-evenly;
}

.block_headerProfil {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #FFD7D7;
    border: solid #4E5166;
    box-shadow: 1px 1px 1px 1px #4E5166;
    border-radius: 5px;
    height: 40px;
    width: 50%;
    align-self: center;
    margin-right: 5px;
    padding-left: 10px;
}

.block_header_profil_pic {
    display: flex;
    align-items: center;
}

.header_profil_pic {
    width: 100%;
    height: 40px;
    border-radius: 200px;
    object-fit: fill;
}

.buttonLogout {
    width: 100px;
    height: 30px;   
    background-color: #FFD7D7;
    border: none;
    cursor: pointer;
}

h2 {
    font-size: 20px;
    color: #4E5166;
}

@media (max-width: 500px) {
    .profilName_profil {
        display: none
    }
    .block_headerProfil {
        padding: 0px;
        margin-right: 10px;
        height: 25px;
    }
    .header_profil_pic {
        height: 35px
    }
    .buttonLogout {
        height: 25px;
    }
}
</style>