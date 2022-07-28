<template>
    <div class="all">
        <Profil />
        <CreatePost />
        <Post />
    </div>
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
    },
}
</script>

<style>
.all {
    display: flex;
    flex-direction: column;
}

</style>