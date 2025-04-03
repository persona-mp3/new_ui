// let this function take the req, and res parameters too
import mysql from 'mysql2'
import dotenv from 'dotenv'
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


export async function validateUser(res, userCred) {
    let email = userCred.email;
    let tempPass = userCred.password;

    if (email === undefined || tempPass === undefined){
        res.status(404).send({msg: "Empty Value"})
        return;
    }

    let query = `select email, password, first_login from bookings where email = (?)`;

    try { 
        const [response] = await pool.query(query, email)

        if (response.length === 0) {
            res.status(404).send({msg: 'User not found'})
            return;
        }
        
        let dbCred = response[0];
        console.log(dbCred)
        // do a password check since they are both in plain strings.
        if (tempPass !== dbCred.password) {
            res.status(402).send({msg: 'Invalid Credntials'})
            return;
        }

        // MySQL returns boolean as 1 and 0 
        // 1 is true and 0 is false
        if (dbCred.first_login !== undefined && dbCred.first_login === 1) {
            console.log('The user can now change their password since firstLogin is defined');
            res.status(300).send({msg: "Reditect user to change password"})
            return;
        }

        console.log('User Authorised, Prompt to change password now')
    } catch (err) {
        throw err
    }
}