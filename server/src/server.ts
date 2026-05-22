import 'dotenv/config' 
import express from 'express'
import type { Express}  from 'express'
import { authRoute } from './routes/authRoute';

const app: Express = express();

app.use(express.json())

const PORT: number = 8000;


//http://localhost:8000/api/auth/register
app.use('/api/auth', authRoute)


app.listen(PORT, ():void => console.log(`Listening on port ${PORT}`))
