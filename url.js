const express = require('express')
const User= require('./routes/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const passportGoogle = require('./routes/passport');

const app = express.Router(); 



app.post('/user/create',User.signup);
app.get('/user/create',User.getSignup);
app.get('/user/signin',User.getSignin);
app.post('/user/signin',User.signin);
app.get('/verification/:token',User.userVerified);
app.get('/*',User.createSignup);
app.get('/user/signout',User.signout);
app.get('/home',User.sessionChecker,User.getHome);

// app.get('/auth/google/callback', 
// passport.authenticate('google', { successRedirect: '/home', failureRedirect: '/' }));

	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { successRedirect: '/profile',
	                                      failureRedirect: '/' }));


module.exports = app;
