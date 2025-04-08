// let this function take the req, and res parameters too
import mysql from 'mysql2'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()

let sqlConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
}


const pool = mysql.createPool(sqlConfig).promise();


export async function saveBooking(res, userData) {
 
let firstName = userData.firstName;
    let lastName = userData.lastName;
    let email = userData.email;
    let address = userData.address;
    let postcode = userData.postcode;
    let bookingType = userData.bookingType;
    let date = userData.date;
    let time = userData.time;
    let temporaryPassword = userData.password;

    const requiredFeilds = [firstName, lastName, email, address, 
                            postcode, bookingType, date, time, temporaryPassword]

    if (requiredFeilds.some(field => field === undefined )) {
        console.log('A value was not found')
        res.send(404).send({msg: 'A field was not found in the data'})
        return;
    }

    let saveQuery = `INSERT INTO bookings 
    
                    (firstName, lastName, email, address,
                    postcode, type, date, time, password
                    )
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    
    
    try { 
        const [response] = await pool.query(saveQuery, requiredFeilds);
        console.log(response)
        res.status(200).send({msg: 'Saved succesfully'})
    } catch (err) {
        throw err
    }


}

// login function first checks if user exsists
// and then validats against the tempoerary password passed into ut
// the server then responds based on if this is the first time the user has logged in
// if true, it prompts the frontend to change their password before commencing


export async function validateUser(res, userCred, req) {
    let email = userCred.email;
    let tempPass = userCred.password;

    if (email === undefined || tempPass === undefined){
        res.status(404).send({msg: "Empty Value"})
        return;
    }

    let query = `select id, email, password, first_login from bookings where email = (?)`;

    try { 
        const [response] = await pool.query(query, email)

        if (response.length === 0) {
            res.status(404).send({msg: 'User not found'})
            return;
        }
        
        let dbCred = response[0];
        

        const isPassValid = await bcrypt.compare(tempPass, dbCred.password)

        if (!isPassValid) {
            const msg = {
                statusCode: 401,
                reason: "Invalid Credentials",
            }
            res.status(401).json(msg)
            return;
        }
        console.log('Login successful')
        await sendUIData(res, dbCred.id, req)
        return dbCred.id
        // MySQL returns boolean as 1 and 0 1 is true and 0 is false
/*         if (dbCred.first_login !== undefined && dbCred.first_login === 1) {
            console.log('The user can now change their password since firstLogin is defined');
            res.status(201).send({msg: "Reditect user to change password"})
            return;
        }

        console.log('User Authorised, Prompt to change password now')
  */       // but for now lets just redirect them to the dashboard 
 
        // do a password check since they are both in plain strings.
/*         if (tempPass !== dbCred.password) {
            res.status(402).send({msg: 'Invalid Credntials'})
            return;
        }
 */       // so they can see their current booking and past bookings
    } catch (err) {
        throw err
    }
}


async function sendUIData(res, userId, req) {
    let query = `
                select firstName, lastName, address,postcode,
                email, type, date, time from bookings
                where id=(?)
    `
    

    try { 
        const [dbResponse] = await pool.query(query, userId);
        const userCreds = dbResponse[0];

        if (userCreds === undefined){
            console.log('Unexpected Error')
            res.status(500).send({msg: "Unexpected Error"})
            return
        }
        
        req.session.user = userCreds
        console.log('before redirect -->', req.session.id)

        res.redirect('/dashboard')
    } catch (err) {
        throw err
    }
}
