import { pool } from './globals.js';
import dotenv from 'dotenv';
dotenv.config();
export async function RenderUI(req, res, userId) {
    const query = `
                    select firstName, lastName, address, postcode,
                    email, type, date, time from bookings
                    where id=(?)
                `;
    try {
        const response = await pool.query(query, userId);
        const userData = response[0][0];
        console.log(userData);
        if (userData === undefined) {
            console.log(`[unexpected error]`);
            res.status(500).send({ message: "Unexpected Error" });
            return;
        }
        // modify cookie for the user
        const userCookie = req.session;
        // const modCookie = userCookie.user
        userCookie.user = userData;
        userCookie.loginKey = process.env.LOGIN_KEY;
        res.redirect('/dashboard');
        // await CheckCookie(req, res)
        // req.session.user = userData
    }
    catch (err) {
        console.log(err);
    }
}
