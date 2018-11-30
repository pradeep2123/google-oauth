const  express= require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

var Schema = mongoose.Schema; 

var userSchema = new Schema({
 first_name  : {type:String},
 last_name   :{ type    : String},
 email             :{ type    : String},
 password     : { type : String},
 mobile_number:{ type:Number},
 active:{type:Boolean},
 token:{type:String},
 google: {
       id: { type: String },
       google_token: { type: String },
       name:{type:String},
       email: { type: String }
},
 created_at : {type:Date, default:Date.now},
 });

var User= mongoose.model('user', userSchema)
    module.exports ={
       User:User
}

       
