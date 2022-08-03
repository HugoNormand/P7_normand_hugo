<template>
    <Header />
    <main class="all">
        <Profil />
        <CreatePost />
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
}
</script>

<style>
.all {
    border: solid #4E5166 ;
    box-shadow: 2px 8px 12px 1px #4E5166 ;
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 90%;
}
</style>