const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.register);

// router.get('/register', users.renderRegisterForm);
// router.post('/register', users.register);

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// router.get('/login', users.renderLoginForm);
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;