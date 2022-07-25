<template>
    <div class="all">
        <button class="buttonLogout" v-on:click="logOut()">logout</button>
        <CreatePost />
        <Post />
    </div>
</template>

<script>
import Post from '../components/Post.vue';
import CreatePost from '../components/CreatePost.vue'
export default {
    components: {
        Post,
        CreatePost
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
.all {
    display: flex;
    flex-direction: column;
}

.buttonLogout {
    height: 30px;
    width: 100px;
    align-self: flex-end;
}

</style>