const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const {checkReturnTo} = require('../middleware.js')

router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async(req, res, next) => {
    try{
    const {email, username, password}= req.body;
    const user = new User({email , username})
    const registeredUser  = await User.register(user,password);
    req.login(registeredUser,err => {
        if(err) return next(err); 
        req.flash('success','Welcome to Yelp Camp!')
        res.redirect('/campgrounds');
     })
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
    
    // console.log(registerUser)
    
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res)=> {
    req.flash('success','Welcome Back!!')
    const redirectUrl = req.session.returnTo || '/campgrounds' ;
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
        }
      res.redirect('/campgrounds');
    });
  });
module.exports = router;