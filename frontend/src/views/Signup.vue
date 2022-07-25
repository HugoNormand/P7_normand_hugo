<template>
<div id="block">
    <form @submit="createAccount">
      <h1>Signup</h1>
      <p>Vous avez déjà un compte ? <router-link to="login">Connexion</router-link></p>
        <div class="form-group">
          <label for="exampleInputEmail1">E-mail : </label>
          <input type="email" v-model= "dataForm.email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Entrer son e-mail">
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1">Pseudo : </label>
          <input type="text" v-model= "dataForm.username" class="form-control" id="exampleInputText" aria-describedby="emailHelp" placeholder="Entrer son pseudo">
        </div>

       <div class="form-group">
          <label for="exampleInputPassword1">Mot de passe : </label>
          <input type="password" v-model= "dataForm.password" class="form-control" id="exampleInputPassword1" placeholder="Entrer son mot de passe">
        </div>
    <button type="submit" class="btn btn-primary">Créer son compte</button>
  </form>
</div>
</template>

<script>
export default {
    data() {
      return {
        dataForm: { 
          email: null,
          username: null,
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
       createAccount(e) {
          e.preventDefault() 
          let account = {
                ...this.dataForm
          }
          fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: {
              'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })
        .then((res) => {
                if (res.ok) {
                    this.$router.push("/login")
                    return res.json();
                }
          }) 
        }
      }
    }
</script>

<style>
#block {
  display: flex;
  justify-content: center;
}

form {
  display: flex;
  flex-direction: column;
  border: black;
  border-style: solid;
  padding: 20px;
  width: 60%;
  color: black;
  background-color: #FFD7D7;
}

a {
  text-decoration: none;
}
</style>