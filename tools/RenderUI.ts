import {pool, bcrypt, Request, Response} from './globals.js';
import {CheckCookie} from './DashboardAuth.js'
import dotenv from 'dotenv'
import session from 'express-session';


dotenv.config()
// allow express session to allow you add modifications to the cookie
declare module 'express-session' {
    interface SessionData {
        user?: any
        loginKey?:any
    }
}

// data that is returned from the server
interface UserData {
    firstName: string,
    lastName: string,
    address: string,
    postcode: string,
    password: string,
    email: string,
    type: string,
    date: string,
}

interface SessionData {
    user?: UserData
}

export async function RenderUI(req: Request, res: Response, userId: number): Promise<void>{
    const query = `
                    select firstName, lastName, address, postcode,
                    email, type, date, time from bookings
                    where id=(?)
                `
    try { 
        const response = await pool.query(query, userId)
        const userData: UserData | undefined = response[0][0];
        console.log(userData)
        
        if (userData === undefined) {
            console.log(`[unexpected error]`)
            res.status(500).send({message: "Unexpected Error"})
            return
        }

        // modify cookie for the user
        const userCookie = req.session
        // const modCookie = userCookie.user
        userCookie.user = userData
        userCookie.loginKey = process.env.LOGIN_KEY
        res.redirect('/dashboard')
        
        // await CheckCookie(req, res)
        // req.session.user = userData
        
        
    } catch (err) {
        console.log(err)
    }


}