<template>
    <div class="block_headerProfil">
        <h2>{{ this.profilName }}</h2>
        <button class="buttonLogout" v-on:click="logOut()"><i class="fa-solid fa-right-from-bracket"></i></button> 
    </div>   
</template>

<script>
export default {
    data() {
        return {
            profilName: JSON.parse(localStorage.getItem('user')).username
        }
    },
    methods: {
        logOut(){
            localStorage.clear();
            this.$router.push("/login")
        }
    }
}
</script>

<style>

.block_headerProfil {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.buttonLogout {
    width: 100px;
    height: 30px;   
    background-color: #4E5166;
    border: none;
    cursor: pointer;
}

h2 {
    font-size: 20px;
    color: #FFD7D7;
}
</style>