import express from 'express'
import type { Express, Request, Response } from 'express'
import 'dotenv/config' 

const app: Express = express();

app.use(express.json())

const PORT: number = 8000;

//http://localhost:8000
app.get('/', (req: Request, res: Response): void => {
    res.json({message: "hi"})
})

app.listen(PORT, ():void => console.log(`Listening on port ${PORT}`))
