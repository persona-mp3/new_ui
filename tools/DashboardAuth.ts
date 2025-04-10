import {Response, Request} from './globals.js'
import session from 'express-session'
import dotenv from 'dotenv'

dotenv.config()



declare module 'express-session' {
    interface SessionData {
        user?: any
        loginKey?: any
    }
}



export async function CheckCookie(req: Request, res: Response): Promise<void>{
    // we need to check if the user has a cookie identify
    // for example if the login was succesfull
    // we will need to sign the cookie that says@ "heyLoginSuccess"
    // then using this function, we can check if the person that is been redirected to this page has that signature
    console.log(`[DASHBOARD API ENDPOINT: checking cookie]`) 
    
    if (!req.session) {
        console.log(['user tried accessing via url, not signed in'])
        res.redirect('/login')
        return
    }
    
    const loginKey = req.session.loginKey;     
    
    if (!loginKey) {
        console.log('user does not have login key', loginKey)
        res.redirect('/login')
        return
    }
    
    const verificationKey: string | undefined = process.env.LOGIN_KEY
    if (loginKey!== verificationKey) {
        res.status(200).redirect('/login')
        console.log('login key not the same')
        return 
    }

    console.log('USER HAD LOGIN KEY') 
    res.status(200).render('dashboard')
}
