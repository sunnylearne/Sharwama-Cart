var express = require('express');
var router = express.Router();
var csrf =  require('csurf');
var passport = require('passport');
let Cart = require('../models/cart');
let Product = require('../models/product');

let csrfProtection = csrf(); 
router.use(csrfProtection);


router.get('/profile',isLoggedIn, function(req, res, next){
    res.render('user/profile'); 
});
router.get('/logout',isLoggedIn,function(req, res, next){
    req.logout();
   res.redirect('/');
});
// checking where login is not needed
router.use('/', isNotLoggedIn,function(req,res,next){
   return next();
});


router.get('/signup',function(req, res, next){
    let messages = req.flash('error');
    res.render('user/signup',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0});
});
router.post('/signup',passport.authenticate('local.signup',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}),function(req,res,next){
    if(req.session.oldUrl){
        let oldLink = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldLink);
        
    }else{
        res.redirect('/user/profile');
    }
});

router.post('/signin',passport.authenticate('local.signin',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}),function(req,res,next){
    if(req.session.oldUrl){
        let oldLink = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldLink);
    }else{
        res.redirect('/user/profile');
    }
});
router.get('/signin',function(req, res, next){
    let messages = req.flash('error');
    res.render('user/signin',{csrfToken: req.csrfToken(),messages: messages, hasErrors: messages.length > 0});
});

module.exports = router; 

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}
function isNotLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}