import 'dotenv/config' 
import express from 'express'
import type { Express}  from 'express'
import { authRoute } from './routes/authRoute';
import { favoriteRoute } from './routes/favoriteRoute'

const app: Express = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))//handles data with special characters (password, email)

const PORT: number = 8000;

//http://localhost:8000/api/auth/register
app.use('/api/auth', authRoute)

//http://localhost:8000/api/user/favorites
app.use('/api/user', favoriteRoute)

app.listen(PORT, ():void => console.log(`Listening on port ${PORT}`))
