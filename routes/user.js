const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser')
const {isLoggedIn} = require('../middleware')

const User = require('../models/user');

const Role = Object.freeze({
    admin: 0,
    teacher: 1,
    student: 2,
});

router.use(bodyParser.urlencoded({ extended: false }))


router.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body
        if (!username.endsWith('@paruluniversity.ac.in')) {
            res.send("Only Parul University emails can sign up")
            return
        }
        const user = new User({ name, username, role: Role.admin })
        console.log(user)
        await User.register(user, password)
        res.send("User created")
    } catch (e) {
        console.log(e)
        res.send("Error creating user")
    }
})

router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.user)
    res.send("Logged in")
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
    })
    res.send('Logged out');
})

module.exports = router;
