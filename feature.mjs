import prompt from 'prompt-sync';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config()
const input = prompt();

let sqlConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
}

const pool = mysql.createPool(sqlConfig).promise();


function validateUser() {
    generateTemporaryPassword();
    
    const getUserEmail = input('Enter email address: ');
    
    if (userCred.temporaryPassword === undefined) {
        const getPassword = input('Enter password: ');
        console.log('object not updated yet')
    }
    if (getPassword !== userCred.temporaryPassword) {
        console.log('Try again');
        return;
    }

    console.log(getUserEmail, getPassword)

}



async function alterTable() {
    let query = `alter table bookings modify column password varchar(255) NOT NULL`;
    query = `select * from bookings where password is null`
    query = `update bookings set password="lilyatchy&ian" where password is null`;
    query = `select * from bookings`
    query = `alter table bookings modify column password varchar(255) not null`;
    query = `describe bookings`

    try { 
        const [response] = await pool.query(query)
        console.log('DB response to alter statement')
        console.log(response)
    } catch(err) {
        throw err
    }

}





// await alterTable()




// this will be done on the front end

function generateTemporaryPassword(userCred) {
    let lengthOfPassword = 10
    let temporaryPassword = '';
    let characters = `!$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?/`;
    for (let i=0; i < lengthOfPassword; i++){
        temporaryPassword += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    userCred.password = temporaryPassword;
    console.log(userCred);

    return userCred
}





// validateUser()

// calls generateTemporaryPassword function 
async function saveUser (userCred){
    let userPass = generateTemporaryPassword(userCred);

    let firstName = userPass.firstName;
    let lastName = userPass.lastName;
    let email = userPass.email;
    let address = userPass.address;
    let postcode = userPass.postcode;
    let bookingType = userPass.bookingType;
    let date = userPass.date;
    let time = userPass.time;
    let temporaryPassword = userPass.password;

    const requiredFeilds = [firstName, lastName, email, address, 
                            postcode, bookingType, date, time, temporaryPassword]

    if (requiredFeilds.some(field => field === undefined )) {
        console.log('A value was not found')
        return;
    }


    let query = `insert into bookings
                (firstName, lastName, email, address, 
                postcode, type, date, time, password
                ) 
                values (?, ?, ?, ?, ?, ?, ? , ?, ?)
                `

    try { 
        const [response] = await pool.query(query, requiredFeilds);
        console.log(response)

    } catch(err) {
        throw err
    }
}



const userCred = {
    firstName: 'Yves',
    lastName: 'Tumor',
    email: 'yvestumor@gmail.com',
    address: '43 Virginia Wall Street',
    postcode: "RY2 9FW",
    date: "2025-04-14",
    time: "01:48",
    bookingType: 'Other',

}



// calls promptPassword >> this is based on first time login
async function updateUserPass() {
    const email = input('Enter email address >')
    const password = input('Enter password > ');
    
    //call query

    let checkQuery = `select id, email, password from bookings where email = (?)`;
    
    try { 
        const [response] = await pool.query(checkQuery, email);
        
        if (response.length === 0) {
            console.log('no user found')
            return;
        }
        
        let userCred = response[0];
        
        if (userCred.password !== password) {
            console.log('wrong password', userCred.password, password);
            return;
        }
        
        console.log('User Authorised, prompt them to change password')
        console.log(userCred)
        
        await promptPassword(userCred.id)
        return userCred.id
        
    } catch (err) {
        throw err
    }
    
}
// await saveUser(userCred)

async function promptPassword(userId) {
    const newPass = input('Please update your password > ');
    let hashedPass = await bcrypt.hash(newPass, 13)
    
    let updateQuery = `update bookings set password=(?) where id=(?)`;
    
    try { 
        const [response] = await pool.query(updateQuery, [hashedPass, userId]);
        console.log(response)
    } catch (err) {
        throw err
    }
    
}


async function validateUserLogin(userCred) {
  console.log(`[This function tests login functioality]`)
  let email = input('Enter your email address --> ')
  let password = input('Enter your password --> ')
  
  if (password.trim() === '') {
    console.log('Empty value passed in')
    return
  }
  
  let query = `select id, email, password, first_login from bookings where email = (?)`
  try {
    const [response] = await pool.query(query, email);
    if (response.length === 0) {
      console.log('No user with that email found')
      return;
    }


    // use bcrypt.compare to validate passwords
    let dbResponse = response[0];

    let isValid = await bcrypt.compare(password, dbResponse.password);

    if (!isValid) {
      console.log('Invalid Cred');
      return
    }

    console.log('User Authenticated -->', isValid)
    console.log(dbResponse)
    


    let [getUserData] = await pool.query(`select * from bookings where id = (?)`, dbResponse.id)

    console.log('All users information')
    console.log(getUserData[0]);


    const userData = getUserData[0]
    let uiData = {}
    uiData.name = userData.firstName + ' ' + userData.lastName
    uiData.address = userData.address;
    uiData.postcode = userData.postcode;
    uiData.type = userData.type;
    uiData.date = `Scheduled On: ${new Date(userData.date).toLocaleDateString()}`
    
    console.log(`--------------`)
    console.log('Render uiData')
    console.log(uiData)
  } catch(err) {
    throw err
  }
  // use bcypt.comapre to comapre stored password and hashedPassword
  
}

// await validateUserLogin(userCred)
//await saveUser(userCred)
//await updateUserPass()
