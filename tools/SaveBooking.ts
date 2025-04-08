import  mysql from 'mysql2'
import  dotenv from 'dotenv'
import  bcrypt from 'bcrypt'
// import express from 'express'
// import {Request} from 'express'
import express, {Request, Response} from 'express'


// const app = express()
dotenv.config()

// declare global {
//     interface Response {
//         status(code: number): this,
//         send(body: string): this
//     }
// }

interface SQLConfig {
    host: string | undefined ,
    user: string | undefined ,
    password: string | undefined ,
    database: string | undefined ,
}

interface SQLResponse {
    serverStatus: number
}

interface BookingCreds {
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    postcode: string,
    bookingType: string,
    date: string,
    time: string
    password: string
}

const sqlConfig: SQLConfig = {
    host: process.env.HOST, 
    user: process.env.USER,     
    password: process.env.PASSWORD, 
    database: process.env.DB
}

export const pool = mysql.createPool(sqlConfig).promise()


export async function saveBookingTS(req: Request, res:Response, bookingCreds: BookingCreds): Promise<void>{

    const {firstName, email, lastName, address, postcode, bookingType, date, time, password} = bookingCreds;
    const requiredFields: string[] = [firstName, lastName, email, address, 
                                        postcode, bookingType, date, time, password]

    if (requiredFields.some(field => field === undefined )) {
        console.log('a value was not found');
    
        
        res.status(400).send({message: 'A field was not found'})
        return
    }
    
    const query: string = `insert into bookings 
                    (firstName, lastName, email, address,
                    postcode, type, date, time, password)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`


    try { 
        const [response]  = await pool.query(query, requiredFields);
        res.status(200).send({message: "Booking saved successfuly"})
        console.log(response)

    } catch (err ) {
        console.log(err)
        if (err.sqlState === '23000') {
            res.status(400).send({message: "User already exists"});
            return
        }
        throw err
    }
    
    
}



