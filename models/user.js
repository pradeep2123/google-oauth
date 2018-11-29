const  express= require('express');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

var Schema = mongoose.Schema; 

var userSchema = new Schema({
 first_name  : {type:String, required:true},
 last_name   :{ type    : String,required : true},
 email             :{ type    : String,required : true, index:false},
 password     : { type : String,required : true},
 mobile_number:{ type:Number,required : true },
 active:{type:Boolean,default: false},
 token:{type:String, required:true},
 google: {
       id: { type: String },
       google_token: { type: String },
       email: { type: String },
       email:{type:String}
},
 created_at : {type:Date, default:Date.now},
 });

var User= mongoose.model('user', userSchema)
    module.exports ={
       User:User
}

       