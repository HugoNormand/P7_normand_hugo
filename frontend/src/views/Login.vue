<template>
 <div id="block">
  <form @submit="accountConnexion" class="block_login">
    <h1>Login</h1>
    <p>Vous n'avez pas de compte ? <router-link to="/signup">Créer un compte</router-link></p>
      <div class="form-group">
        <label for="exampleInputEmail1">E-mail : </label>
        <input type="email" v-model= "dataForm.email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Entrer son e-mail">
      </div>

     <div class="form-group">
       <label for="exampleInputPassword1">Mot de passe : </label>
       <input type="password" v-model= "dataForm.password" class="form-control" id="exampleInputPassword1" placeholder="Entrer son mot de passe">
     </div>
  <button type="submit" class="btn btn-primary">Connexion</button>
 </form>
</div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
      return {
        dataForm: { 
        email: null,
        password: null
      } }
    },
    beforeCreate() {
          if (JSON.parse(localStorage.getItem("loggedIn")) == true) {
                    this.$router.push("/home")
          }
          return ;
    },
    methods: {
       accountConnexion(e) {
          e.preventDefault() 
          let connexion = {
                ...this.dataForm
          } 
          const instance = axios.create({
              baseURL: 'http://localhost:3000/api/post'
          })
          axios.post("http://localhost:3000/api/auth/login", connexion)
          .then((res) => {
            if (connexion.email == 'admin@admin.com') {
              localStorage.setItem("admin", JSON.stringify(res.data.userId)),
              localStorage.setItem("user", JSON.stringify(res.data)),
              localStorage.setItem("loggedIn", true),
              this.$router.push("/home")
            } else {
              localStorage.setItem("user", JSON.stringify(res.data)),
              localStorage.setItem("loggedIn", true),
              this.$router.push("/home")
            }         
             }      
          ) 
        }, 
      },  
    }
</script>

<style>
.block_login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>