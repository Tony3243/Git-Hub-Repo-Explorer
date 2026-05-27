import jwt from 'jsonwebtoken'
import type {JwtPayload} from 'jsonwebtoken'
import type {Request, Response, NextFunction} from 'express'
import type {Payload, Local} from '../dataTypes/sqlData'
import {variables} from '../config'


//I use res.locals as on object to pass data in view
export function tokenCheck(req: Request<{}, {}, {token: string}>, res: Response<Payload, Local>, next: NextFunction) {
    const bearer: string | undefined = req.headers['authorization'];
    if(!bearer) {
        console.log("Token does not exist");
        return res.status(401).json({message: "Token doesn not exist"})
    }
    const token= bearer.split(' ')[1];
    if(!token) {
        console.log("no token");
        return res.status(401).json({message: "Token does not exist"})
    }
    try{
        const decoding = jwt.verify(token, variables.jwtToken) as JwtPayload
        res.locals.user = decoding;//res.locals.user is initialized adnd used as a global variable to display the token's payload
        next()
    }catch(err) {
        console.log("Did not pass verification");
        res.status(500).json({message: "Verification of token failed"})
    }
}