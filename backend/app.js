const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
require('dotenv').config()
const path = require('path')

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT,
{ 
  useNewUrlParser: true,
  useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use(bodyParser.urlencoded())

app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images'))) 
app.use('/api/auth', userRoutes)
app.use('/api/post', postRoutes)

module.exports = app;