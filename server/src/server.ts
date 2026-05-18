import express from 'express'
import type { Express } from 'express'

const app: Express = express();

app.use(express.json())

const PORT = 8000;

//https://localhost:8000
app.get('/', (req, res) => {
    res.json({message: "hi"})
})

app.listen(PORT, ():void => console.log(`Listening on port ${PORT}`))
