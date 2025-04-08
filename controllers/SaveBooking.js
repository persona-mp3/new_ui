import mysql from 'mysql2';
import dotenv from 'dotenv';
// const app = express()
dotenv.config();
const sqlConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB
};
export const pool = mysql.createPool(sqlConfig).promise();
export async function saveBookingTS(req, res, bookingCreds) {
    const { firstName, email, lastName, address, postcode, bookingType, date, time, password } = bookingCreds;
    const requiredFields = [firstName, lastName, email, address,
        postcode, bookingType, date, time, password];
    if (requiredFields.some(field => field === undefined)) {
        console.log('a value was not found');
        res.status(400).send({ message: 'A field was not found' });
        return;
    }
    const query = `insert into bookings 
                    (firstName, lastName, email, address,
                    postcode, type, date, time, password)
                    values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        const [response] = await pool.query(query, requiredFields);
        res.status(200).send({ message: "Booking saved successfuly" });
        console.log(response);
    }
    catch (err) {
        console.log(err);
        if (err.sqlState === '23000') {
            res.status(400).send({ message: "User already exists" });
            return;
        }
        throw err;
    }
}
