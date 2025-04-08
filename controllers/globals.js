import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
let sqlConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
};
const pool = mysql.createPool(sqlConfig).promise();
export { pool, bcrypt };
