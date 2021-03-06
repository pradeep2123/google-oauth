const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment')
const crypto = require('crypto')
const _ = require('underscore');
const mongoose = require('mongoose');       
const bodyParser = require('body-parser');
const cookieParser= require('cookie-parser');
const jwt = require('jsonwebtoken');
var fs= require('fs')
const mongodb = require('mongodb')
const exphbs  = require('express-handlebars');
const Handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const passport = require('passport');
const unirest = require('unirest');
var Freshdesk = require('freshdesk-api')


const User = require('../models/user').User
const Auth = require('../routes/auth')
const JWT_SECRET= 'Gli7dFsW-J_82cO-Ed_s_ODeDpAFASPD-ge3qLuI6qT6krM3KjOtTsPysR2PkiP9yUdiJrTLwpeNtEaDhwyQmybGTsUTZ1bxZnZ5bWF9_nW7Tfex6lJxQi1Vwq68RTfzie6xa_N7muxISpLCYd8g_c_zOJcmyjkCdZAW5z0LFBZB9icGmJuOMv-VldgroKxJeIh88jEBWWR3eGGU9ZzprnzH6Wi_GONq2q0DELDzDAjmJDelfK1hBOY2vaSfa0lIlZEhLe2YsFwBAMtuqqBnhT3rxGBWkxq2QhN6Wp2bvuhaYC8-_eoKBBeEW31qz2Z6VDbrtuFZXOXZ9iBs9NCAUQ';

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: '***********',
           pass: '***********'
       }
});

const freshDesk = (req,res,next) =>{
    var freshDesk = new Freshdesk('https://kumarapypradee.freshdesk.com', 'RXYr8tpQirxRxayOvJa');
   
    freshDesk.createTicket({
        name: 'ticket',
        email: 'test@test.com',
        subject: 'test sub',
        description: 'test description',
        status: 2,
        priority: 1
    }, function (error, data) {
        if(error){
            return res.render('dashboard',{error:"NOT AUTHORIZED"})
        }
        else{
            return res.render('dashboard',{message:"SUCCESFFULY AUTHORIZED"});
        }
    })
    
}

const sessionChecker = (req, res, next) => {
    if (req.cookies.token1) {
        jwt.verify(req.cookies.token1, JWT_SECRET, function(error, decoded){
            if(error){
                return res.render('signin', {error:"FIRST SIGNIN"}) 
            }
            else
            req.user_id = decoded._id;
            User.findById(req.user_id, function(err, user){
                req.user = user;
                return next();
            })
        })  
    }  
    else{
        res.render('signin', {error:"SIGNIN FIRST"}) 
    }
}

const getSignup= (req,res,next)=>{
    if(req.cookies.token1){
        return res.redirect('/user/home');
    }
    res.render('signup');
}
const createSignup = (req,res,next)=>{
    return res.redirect('/user/create');
}

const getSignin = (req,res,next)=>{
    var msg = req.query.msg;
    if(req.cookies.token1){
        return res.render('dashboard');
    }
  
    return res.render('signin',{msg:msg});
}
const signup =(req, res, next) => { 

    var newUser = new User({
        first_name    :req.body.first_name || req.query.first_name || req.params.first_name,
        last_name     : req.body.last_name || req.query.last_name || req.params.last_name,
        email         : req.body.email || req.query.email || req.params.email,
        password      : req.body.password || req.query.password || req.params.password,
        mobile_number : req.body.mobile_number,
        active : false,
        token         :crypto.randomBytes(16).toString('hex')
    })
    var passwordtest= /^([a-zA-Z0-9@*#]{8,15})$/;
    var mobiletest = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    
    User.findOne({email:newUser.email}, (error,user)=>{
        if(user){
            return res.render('signup',{error:"User already register, please check your email and login it"});
        }
        else if(!user){
            if(!passwordtest.test(newUser.password)){
                return res.render('signup',{error:"password should between 8 and 15 letters"})
            } 
            if(!mobiletest.test(newUser.mobile_number))
             {
               return  res.render('signup',{error:"mobiler number should be 10digits"})
             }  
            var salt = bcrypt.genSaltSync(8);
            var hash = bcrypt.hashSync(newUser.password, salt);
            newUser.password = hash;
            newUser.save(function(error,user_save){
                if(error){
                    return res.render('signup',{error:"Please try again!!!"})
                }

                if(user_save){
                    if(_.isEmpty(user_save)) {
                        return res.render('signup',{error:'please try again !!!!'}) 
                    }
                    var  mailOptions = {
                        to: user_save.email, 
                        subject: 'Login Credentials',
                        text: 'Hello,\n' + 'Please click the link to verify and login to continue services.' +'\n'+'\n http://localhost:2018/user/verification/'+newUser.token
                    };
                    transporter.sendMail(mailOptions, function (error,user_email) {
                        if(error)
                        {
                        return res.render('signup',{error:'Try again, email has not sent for verification!!!'})
                        }  
                        else if(user_email)  
                        return res.render('signup',{user:'Email has sent,Please verify it'})
                    })
                }        
            })
        }
    })
}

const userVerified = function(req,res,next){
    let token = req.params.token || req.query.token;
    if(!token){
        return res.render('signup',{error:"please verify the email"});
    }
    User.findOne({token:token}, function(err,user_verify){
        if(err){
            return res.render('signup',{error:"please signup"});
        }
        if(!user_verify.token){
            return res.render('signup',{error:"please check your email"});
        }
        if(user_verify.active == true){
            return res.render('signup',{error:"User Already verified, please login"});
        }
        user_verify.active = true;
        user_verify.save(function(error,user_verifed){
            if(error){
                return res.render('signup',{error:"please visit your email"})
            }
            else{
                return res.render('signin',{user:"User has been verified, please login"})
            }
        })
    })

}

const signin =(req,res,next)=>{
    var email= req.body.email || req.query.email || req.params.email ;
    var password = req.body.password || req.params.password || req.query.password;

    User.findOne({ email: email}, function(error,user){
        if(error){
            throw error;
        }
        if(!user){
            res.render('signin',{error:"incorrect email or password"});
        }
        else if(user){
            if(bcrypt.compareSync(password,user.password))
            {
                if(user.active == true)
                {                 
                    console.log(user.active)
                    var token= jwt.sign({_id:user._id}, JWT_SECRET, {expiresIn: (24*60*60) });
                    res.cookie('token1',token);
                    return res.render('dashboard',{user:user})
                }
                return res.render('signin',{error:"Please visit your email and verify"});
            }
            else
           return res.render('signin',{error:"incorrect email or password"});
        }
        else{
           return res.render('signin',{error:"Account does not exist"});
        }
    })
}

const signout = (req,res,next)=>{
    if(req.cookies.token1){
    res.clearCookie('token1');
    return res.redirect('/user/signin');
    }
    req.logout();
    return res.redirect('https://accounts.google.com/logout')   
    // return res.redirect('/user/signin');

const getHome = (req,res,next)=>{
    if(req.cookies){
    return res.render('dashboard');
    }
    else{
        var msg = "Please Signin!!!";
        return res.redirect('/user/signin?msg='+msg)
    }
}
module.exports={
    signup:signup,
    getSignin:getSignin,
    getSignup:getSignup,
    createSignup:createSignup,
    userVerified:userVerified,
    signout:signout,
    signin:signin,
    getHome:getHome,
    freshDesk:freshDesk,
    sessionChecker:sessionChecker
}

