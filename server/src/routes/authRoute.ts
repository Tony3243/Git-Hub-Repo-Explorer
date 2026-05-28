import { register, login, refresh, logout } from '../controllers/authController'
import express from 'express'
import type { IRouter } from 'express'

export const authRoute: IRouter = express.Router();

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.post('/logout', logout)
authRoute.post('/refresh', refresh)

// authRoute.get('/test', tokenCheck, (req, res) => {
//     console.log("Middleware worked")
//     res.status(200).json({
//         user: res.locals.user
//     })
// })