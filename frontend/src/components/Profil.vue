<template>
    <div class="block_header_profil_name">
        <!-- affichage photo de profil de l'utilisateur -->
        <div class="block_header_profil_pic">
            <img class="header_profil_pic" v-bind:src="this.profil.profilImage" v-on:click="modifyProfilRoute()" alt="Photo de profil de l'utilisateur">
        </div>
        <!-- boutton pour se logout -->
        <div class="block_headerProfil" v-on:click="logOut()">
            <h1 class="profilName_profil">{{ this.profilName }}</h1>
            <button class="buttonLogout" aria-label="Boutton Logout" title="Boutton Logout"><span style="font-size: 20px; color: #4E5166"><i class="fa-solid fa-right-from-bracket"></i></span></button>
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
        /* fonction pour se logout en supprimant le localstorage et renvoyant sur la page Login */
        logOut(){
            localStorage.clear();
            this.$router.push("/login")
        },
        /* on récupère les infos utilisateurs pour la photo de profil */
        userInfo() {
            const id = JSON.parse(localStorage.getItem('user')).userId
            const token = JSON.parse(localStorage.getItem('user'))
            axios.get(`http://localhost:3000/api/auth/userInfo/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token.token}`
                }
            })
            .then((res) => {this.profil = res.data})
        },
        /* fonction qui mène a la page modifyProfil avec récupération de l'ID */
        modifyProfilRoute() {
            const id = JSON.parse(localStorage.getItem('user')).userId
            this.$router.push(`/modifyProfil/${id}`)
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
    cursor: pointer;
}

.block_header_profil_pic {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.header_profil_pic {
    width: 40px;
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

.profilName_profil {
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
        cursor: pointer;
    }
    .header_profil_pic {
        height: 35px
    }
    .buttonLogout {
        height: 25px;
    }
}
</style>