import dotenv from 'dotenv';
import mysql from 'mysql2'

dotenv.config()

const sqlConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
}

const pool = await mysql.createPool(sqlConfig).promise()
let [response] = await pool.query(`select * from bookings`)
console.log(response)
