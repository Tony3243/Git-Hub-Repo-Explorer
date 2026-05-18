import express from 'express'
import type { Express } from 'express'

const app: Express = express();

app.use(express())

const PORT = 8000;

app.listen(PORT, ():void => console.log(`Listening on port ${PORT}`))
