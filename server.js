import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath } from 'url'


import {saveBooking, validateUser} from './tools.js';

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
app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;


// Routing for different enpoints
// The dashboard pages makes use of an engine template as dynamic data specific to the user will be displayed
// when the login successfully, their details will be passed and accessed via the cookies

app.get('/dashboard', async (req, res) => {
    console.log('dashboard api endpoint')
    console.log('after redirect -->', req.session.id)
    res.status(200).render('dashboard')
})


app.post('/booking', async (req, res) => {
    console.log(req.body)
    let userData = req.body
    let response = await saveBooking(res, userData) 
})


app.post('/login', async (req, res) => {
    let loginCred = req.body
    let response = await validateUser(res, loginCred, req)
})

app.listen(PORT, () => {
    console.log(`[LISTENING....] on port ${PORT}`)
})
