import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Signup.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import ModifyPost from '../views/ModifyPost.vue'
import ModifyComment from '../views/ModifyComment.vue'
import ModifyProfil from '../views/ModifyProfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
     path: '/login',
     name: 'Login',
     component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/modifyPost/:id',
      name: 'ModifyPost',
      component: ModifyPost
    },
    {
      path: '/modifyComment/:id',
      name: 'ModifyComment',
      component: ModifyComment
    },
    {
      path: '/modifyProfil/:id',
      name: 'ModifyProfil',
      component: ModifyProfil
    }
  ]
})

export default router
