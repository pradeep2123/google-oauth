const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment')
const _ = require('underscore');
const path = require('path');
const mongoose = require('mongoose');       
const bodyParser = require('body-parser');
const mongodb = require('mongodb')
const exphbs  = require('express-handlebars');
const Handlebars = require('handlebars');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;



// importing files
var url = require('./url');
mongoose.connect('mongodb://localhost:27017/sprite',{useNewUrlParser: true });
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true  // methods to easy
}));

hbs = exphbs.create({
  handlebars: Handlebars //Pass the Handlebar instance with Swag
});

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/public')));
app.engine('handlebars', hbs.engine);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'handlebars');



app.use('/',url);
app.listen(2018 , console.log('server listening'));



