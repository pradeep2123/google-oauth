var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var passport = require('passport');
var User            = require('../models/user').User
var configAuth = require('../routes/auth').googleAuth;

const Passport_google = function(req,res,next){


    passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
        process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else {
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.google_token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;

                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    })
                    console.log(profile);
                }
            });
        });
    }
    
));
}
 module.exports = Passport_google
