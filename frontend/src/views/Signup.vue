<template>
<div id="block_signup">
    <form @submit="createAccount">
      <h1>Signup</h1>
      <p>Vous avez déjà un compte ? <router-link to="login">Connexion</router-link></p>
        <div class="form-group">
          <label for="exampleInputEmail1">E-mail : </label>
          <input type="email" v-model= "dataForm.email" v-on:change="emailRegExp(dataForm.email)" aria-describedby="emailHelp" placeholder="Entrer son e-mail">
          <p>{{ this.msgErrorMail }}</p>
        </div>

        <div class="form-group">
          <label for="exampleInputEmail1">Pseudo : </label>
          <input type="text" v-model= "dataForm.username" v-on:change="usernameCheck()" aria-describedby="emailHelp" placeholder="Entrer son pseudo">
          <p>{{ this.msgErrorUsername }}</p>
        </div>

       <div class="form-group">
          <label for="exampleInputPassword1">Mot de passe : </label>
          <input type="password" v-model= "dataForm.password" v-on:change="passwordRegExp(dataForm.password)" class="form-control" id="exampleInputPassword1" placeholder="Entrer son mot de passe">
          <p>{{ this.msgErrorPassword }}</p>
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
          username: '',
          password: null
      },
        msgErrorMail: '',
        msgErrorPassword: '',
        msgErrorUsername: '' 
      }
    },
    beforeCreate() {
          if (JSON.parse(localStorage.getItem("loggedIn")) == true) {
                    this.$router.push("/home")
          }
          return ;
    },
    methods: {
       createAccount(e) {
         if (this.emailRegExp && this.passwordRegExp) {
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
           }
          ) 
         } 
        },

        emailRegExp(inputEmail) {
          let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g')
          let testEmail = emailRegExp.test(inputEmail)
          if (testEmail == false) {
            this.msgErrorMail = 'Adresse mail non valide'
          } else {
              return true
         }
        },

        passwordRegExp(inputPassword) {
          let passwordRegExp = new RegExp('^[a-zA-Z0-9.-_]{4,}$')
          let testPassword = passwordRegExp.test(inputPassword)
          if (testPassword == false) {
            this.msgErrorPassword = 'Le mot de passe doit contenir minimum 4 charactères'
          } else {
              return true
          }
        },

        usernameCheck() {
          if (this.dataForm.username == '' || this.dataForm.username == ' ') {
            this.msgErrorUsername = 'Entrez votre pseudo'
          }
        }
      }
    }
</script>

<style>
#block {
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none;
}
</style>