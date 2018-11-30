var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User            = require('../models/user').User
var configAuth = require('../routes/auth');

module.exports = function(app,passport){
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/user/home',
                failureRedirect : '/'
    }));
}
