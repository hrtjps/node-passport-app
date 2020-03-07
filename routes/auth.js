var express = require('express');
var router = express.Router();

var authPassport = require('../auth/google');

router.get('/login', function(req, res, next) {
  res.render('auth/login', {title: 'Please Sign In with:', email:"", password: ""});
})

router.post('/login', authPassport.authenticate('local-login', {
  successRedirect : '/', // redirect to the secure profile section
  failureRedirect : '/auth/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}))

router.get('/signup', function(req, res) {
  res.render('auth/signup',  {title: 'Please Sign Up with:', name:"", email:"", password: ""});
});

router.post('/signup', authPassport.authenticate('local-signup', {
  successRedirect : '/auth/login', // redirect to the secure profile section
  failureRedirect : '/auth/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  }
)

router.get('/google', 
    authPassport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  authPassport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

module.exports = router;