const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRouter = require('./routes/user')
const homeRouter = require('./routes/home')
const passport = require('passport')
const User = require('./models/user')
const localStrategy = require('passport-local')
const session = require('express-session')

require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const sessionOptions = {
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
    }
}

app.use(session(sessionOptions));


app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT



connect()
    .then(() => console.log('MongoDB connected'))
    .catch(error => console.error("Error connecting to MongoDB", error))

async function connect() {
    await mongoose.connect(MONGO_URL)
}

app.use((req,res,next) => {
    res.locals.currentUser = req.user
    next()
})

app.use('/user', userRouter)
app.use('/home', homeRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
