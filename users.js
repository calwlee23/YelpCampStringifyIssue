const User = require('../models/user');
// const router = require('../routes/campgrounds');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;  // Destructuring from req.body
        const user = new User({ email, username });  // Pass the email and username into a new user object
        const registeredUser = await User.register(user, password);  // User.register add the salt, hash the password and store it on the new user.
        console.log(registeredUser);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.logout = (req, res) => {
    // req.logout();
    // req.flash('success', 'Goodbye!')
    // res.redirect('/campgrounds');
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds');
    })
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    // res.redirect('/campgrounds');
};