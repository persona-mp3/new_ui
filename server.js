import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath } from 'url'


// import {saveBooking, validateUser} from './tools.js';
import {saveBookingTS} from './controllers/SaveBooking.js'
import {AuthUser} from './controllers/AuthUser.js'
dotenv.config()

const app = express()
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}))


app.use(session({
    // saveUnitialised and resave are used to make sure all users are not saved in sesion
    secret : "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 6000*60,
        sameSite: 'lax',
        secure: false,
        signed: true
    }
}))



app.use(express.json())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'js')))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;


// Routing for different enpoints
// The dashboard pages makes use of an engine template as dynamic data specific to the user will be displayed when the login successfully, their details will be passed and accessed via the cookies
app.get('/index', async (req, res) => {
    res.status(200).render('index')
})

app.get('/booking', async (req, res) => {
    res.status(200).render('booking')
}) 

app.get('/login', async (req, res) => {
    res.status(200).render('login')
})


app.get('/logout', async (req, res) => {
    req.session.destroy();
    // console.log('session destroyed')
    res.render('index')
})


app.get('/dashboard', async (req, res) => {
    console.log('dashboard api endpoint')
    console.log('after redirect -->', req.session.user)
    res.status(200).render('dashboard')
})


app.post('/booking', async (req, res) => {
    let userData = req.body
    try { 
        let response = await saveBookingTS(req, res, userData)

    }catch (err) {
        throw err
    }
})

app.get('/api/data', async (req, res) => {
    res.json({msg: req.session.user})
})


app.post('/login', async (req, res) => {
    let loginCred = req.body
    let response = await AuthUser(req, res, loginCred)
})

app.listen(PORT, () => {
    console.log(`[LISTENING....] on port ${PORT}`)
})
