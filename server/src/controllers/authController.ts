//import jws from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { supabase } from '../database/supabase'
import type {Request, Response} from 'express'
import type {Users, UserInput, ApiResponse} from '../data/sqlData'

export async function register(req: Request<{}, {}, {
        username: string,
        email: string,
        password: string}>, 
        res: Response<ApiResponse<UserInput>>) {
    const {username, email, password} = req.body;

    if(!username || ! email || !password) {
        console.log("User did not fill all the fields")
        return res.json({message: "Fill put all the fields"})
    }
    console.log('checked1')
    try{
        const querySignin = `SELECT email FROM users WHERE email = $1`
        const isRegistered = await supabase.query<{email: string}>(querySignin, [email])
        console.log('checked2')
    
        //check if user already exist
        if(isRegistered.rows.length > 0) {
            console.log("user already exist. Try logging in")
            return res.status(409).json({message: "User exist. Login instead"})
        }
        const hashedPassword: string = await bcrypt.hash(password, 10);

        const insertQuery = `INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email, created_at`

        const insertingUser = await supabase.query<UserInput>(insertQuery, [username, email, hashedPassword])

        console.log("User Successfully created")
        res.status(201).json(insertingUser.rows[0])
    } catch(err) {
        console.log("error in inserting user: ", err)
        res.status(500).json({message: "User not created"})
    }
}

export async function login(req: Request, res: Response): Promise<void> {

}