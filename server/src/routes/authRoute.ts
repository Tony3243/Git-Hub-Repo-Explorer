import { register } from '../controllers/authController'
import express from 'express'
import type { IRouter } from 'express'

export const authRoute: IRouter = express.Router();

authRoute.post('/register', register)