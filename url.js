const express = require('express')
const User= require('./routes/user');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var configAuth = require('./routes/auth');


const app = express.Router(); 

require('./routes/google')(app,passport);



app.post('/user/create',User.signup);
app.get('/user/create',User.getSignup);
app.get('/user/signin',User.getSignin);
app.post('/user/signin',User.signin);
app.get('/verification/:token',User.userVerified);
app.get('/',User.createSignup);
app.get('/user/signout',User.signout);
app.get('/user/home',User.getHome);

app.get('/freshdesk/auth/callback',User.freshDesk);



module.exports = app;
