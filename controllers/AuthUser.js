// import {pool} from './SaveBooking.js'
import { pool, bcrypt } from './globals.js';
import { RenderUI } from './RenderUI.js';
export async function AuthUser(req, res, userCred) {
    const email = userCred.email;
    const password = userCred.password;
    if (email === undefined || password === undefined) {
        console.log('[email/password returned undefined]]');
        res.status(400).send({ message: "Invalid fields" });
        return;
    }
    if (email.trim() === '' || password.trim() === '') {
        console.log('[email/password empty value]');
        res.status(400).send({ message: "Empty fields" });
        return;
    }
    const query = `
                    select id, email, password, first_login from bookings
                    where email = (?)
    `;
    try {
        const response = await pool.query(query, email);
        const firstAuth = response[0][0];
        // console.log(response[0]) 
        if (firstAuth === undefined) {
            console.log('[user not found]');
            res.status(400).send({ message: "User not found" });
            return;
        }
        const passwordAuth = await bcrypt.compare(password, firstAuth.password);
        if (!passwordAuth) {
            console.log('[invalid credentials]');
            res.status(401).send({ message: "Invalid Credentials" });
            return;
        }
        console.log('User Authenticated');
        await RenderUI(req, res, firstAuth.id);
        return;
    }
    catch (err) {
        console.log(err);
        return;
    }
}
