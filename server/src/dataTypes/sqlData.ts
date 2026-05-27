import type { JwtPayload } from "jsonwebtoken"

//what we use to match our dataset columns
export type Users = {
    id: string,
    username: string,
    email: string,
    password: string,
    created_at: Date
}
//what we send back to the client
export type UserInput = {
    id: string,
    username: string,
    email: string,      
    created_at: Date
}

//generic type for Response parameter that either returns any data specified in the parameter or an error message
export type ApiResponse<T> = T | {message:string}

//payload for refresh token operations
export type RefreshInput = {
    user_id: string, 
}

//OUR RESPONSE GENERICS
 export type Payload = {message: string} | {decoded: JwtPayload}

 //for our res.local to send data to our gitControllers
 export type Local = {user: JwtPayload}
