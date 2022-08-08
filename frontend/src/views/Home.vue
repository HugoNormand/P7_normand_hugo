<template>
    <header>
        <Header />
        <Profil />
    </header>
    <main class="all">
        <CreatePost />
        <h2 class="recent_publication">Publications récentes</h2>
        <Post />
    </main>
</template>

<script>
import Post from '../components/Post.vue';
import CreatePost from '../components/CreatePost.vue'
import Profil from '../components/Profil.vue'
import Header from '../components/Header.vue'
export default {
    components: {
        Post,
        CreatePost,
        Profil,
        Header
    },
    /* si l'utilisateur n'est pas log il ne peux pas aller sur la page /home */
    beforeRouteEnter(routeTo, routeFrom, next) {
        let status = localStorage.getItem('loggedIn');
        if (!status) {
            next({ name: 'Login' })
        }
        next()
    },
}
</script>

<style>
.all {
    border: solid #4E5166 ;
    box-shadow: 2px 8px 12px 1px #4E5166 ;
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 70%;
    padding-top: 15px;
    background-color: white;
}

header {
    display: flex;
    justify-content: space-between;
    border-bottom: solid #4E5166;
    margin-bottom: 40px;
    background-color: white;
}

.recent_publication {
    font-size: 20px;
    margin-left: 10px;
    color: #4E5166;
    font-weight: bold;
    border-bottom: solid #4E5166;
}

@media (max-width: 650px) {
    .all {
        width: 100%;
    }
}
</style>