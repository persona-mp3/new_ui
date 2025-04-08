import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';


import {saveBooking, validateUser} from './tools.js';

dotenv.config()

const app = express()
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;
app.get('/api/userData', async (req, res) => {
    res.set("Content-Type", "application/json")
    let uiData = {
        name: "John Mayer",
        address: "Welcome to Costco",
        email: "johnmayerdeeznuts@gmail.com",
        postcode: "FY2 9FR",
        type: "DEEZ NUTS",
        date: "August 23, 2025"
    }
    
    res.status(200).json({msg: uiData})
})


app.post('/booking', async (req, res) => {
    console.log(req.body)
    let userData = req.body
    let response = await saveBooking(res, userData) 
})


app.post('/login', async (req, res) => {
    let loginCred = req.body
    let response = await validateUser(res, loginCred)
})
/* 
app.get('api/userData', async (req, res) => {
    res.set("Content-Type", "application/js")
    let uiData = {
        name: "John Mayer",
        address: "Welcome to Costco",
        postcode: "FY2 9FR",
        type: "DEEZ NUTS",
        date: "August 23, 2025"
    }
    
    res.status(200).json({msg: uiData})
}) */

app.listen(PORT, () => {
    console.log(`[LISTENING....] on port ${PORT}`)
})
