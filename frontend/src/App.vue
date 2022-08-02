<script>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
export default {
  components: {
    Header
  }
}
</script>

<template> 
<Header />
<RouterView></RouterView>
</template>

<style>
/* @import '@/assets/base.css'; */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap');

body {
  background-color: #FFD7D7;
  font-family: 'Lato';
  color: white;
}

textarea {
  resize: none;
}
</style>
