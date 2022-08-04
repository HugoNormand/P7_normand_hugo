<template>
    <div class="block_headerProfil">
        <h2>{{ this.profilName }}</h2>
        <button class="buttonLogout" v-on:click="logOut()"><span style="font-size: 20px; color: #4E5166"><i class="fa-solid fa-right-from-bracket"></i></span></button> 
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
    background-color: #FFD7D7;
    border: solid #4E5166;
    box-shadow: 1px 1px 1px 1px #4E5166;
    border-radius: 5px;
    height: 50px;
    align-self: center;
    margin-right: 5px;
    padding-left: 10px;
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
</style>