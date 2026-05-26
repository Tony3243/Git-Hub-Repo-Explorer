import jwt from 'jsonwebtoken'
import type {JwtPayload} from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {variables} from '../config'
import { supabase } from '../database/supabase'
import type {Request, Response} from 'express'
import type {Users, UserInput, ApiResponse, RefreshInput} from '../dataTypes/sqlData'

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

export async function login(req: Request<{}, {}, {
    email: string, password: string}>,
    res: Response<ApiResponse<{access: string, refresh: string}>>) {
    const {email, password} = req.body;

    if(!email || !password) {
        console.log("Fill out all the fields");
        return res.status(401).json({message: "Fill out all the fields"})
    }

    try {
        //validates if user email exist in db
        const isUserValid = await supabase.query<Users>(`SELECT id, username, email, password FROM users WHERE email = $1`, [email]);
        if(isUserValid.rows.length === 0) {
            console.log("couldn't find email");
            return res.status(401).json({message: 'User email or password is invalid'})
        }

        //Validates if user found
        const specificUser = isUserValid.rows[0]
        if(!specificUser) {
            return res.status(401).json({message: "User not found"})
        }

        const comparingPassword = await bcrypt.compare(password, specificUser.password)
        if(!comparingPassword) {
            console.log("Password is invalid")
            return res.status(401).json({message: "User email or password is invalid"})
        }

        const accessToken: string = jwt.sign({id: specificUser.id, email: specificUser.email}, variables.jwtToken, {expiresIn: '1h'});
        const refreshToken: string = jwt.sign({id: specificUser.id, email: specificUser.email}, variables.refreshToken, {expiresIn: "7d"});

        const tokenInsertResult = await supabase.query(`INSERT INTO refresh_tokens(user_id, token) VALUES($1, $2) RETURNING id, user_id, token, created_at`, [specificUser.id, refreshToken]);
        
        if (tokenInsertResult.rows.length === 0) {
            console.error("Failed to store refresh token");
            return res.status(500).json({message: "Failed to complete login"})
        }
        res.status(200).json({access: accessToken, refresh: refreshToken})
    }catch(err) {
        res.status(500).json({message: 'Trouble creating token'})
    }
}

export async function refresh(req: Request<{}, {}, {
    user_id: string, token: string}>, 
    res: Response<ApiResponse<{accessToken: string}>>) {
    const {token} = req.body;
    if(!token) {
        console.log("Could not find token");
        return res.status(500).json({message: "Could not find token"})
    }
    try{
        //we only need the userId to create the new accesstoken
        const tokenExist = await supabase.query<RefreshInput>(`SELECT user_id FROM refresh_tokens WHERE token = $1`, [token])
        if(tokenExist.rows.length === 0) {
            console.log("couldn't find matching token");
            return res.status(401).json({message: "Couldn't find token"})
        }

        // verifies token
        const decoding = jwt.verify(token, variables.refreshToken) as JwtPayload //JwtPayload handles getting the payload through type Casting and use variable to access id
        //uses the payload from .verify to create a new access token.
        const accessToken: string = jwt.sign({id: decoding.id}, variables.jwtToken, {expiresIn: '7d'});
        res.status(200).json({accessToken: accessToken})
    }catch(err) {
        console.log("Error in creating refreshtoken");
        res.status(400).json({message: "Trouble in creating refresh token"})
    }
}

export async function logout(req: Request<{}, {}, {token: string}>, res: Response<{message: string}>) {
    const {token} = req.body;
    //check if token exist
    if(!token) {
        console.log("Token does not exist");
        return res.status(402).json({message: "Cannot find token"})
    }

    if(!process.env.REFRESH_TOKEN) {
        console.log("Refresh does not exist")
        return res.status(401).json({message: "Refresh does not exist"})
    }
    try {
        //accessing user_id by verifying the token so that it can give us the id
        const decoding = jwt.verify(token, process.env.REFRESH_TOKEN) as JwtPayload
        const deletingToken = await supabase.query(`DELETE FROM refresh_tokens WHERE token = $1 and user_id = $2`, [token, decoding.id]);
        if(deletingToken.rowCount === 0) {
            console.log("Couldn't delete token");
            return res.status(500).json({message: "Couldn't delete token"})
        }
        res.status(200).json({message: "User successfully logged out."})
    } catch(err) {
        console.log("Difficulty in deleting token")
        res.status(500).json({message: "Difficulty in deleting token"})
    }
}