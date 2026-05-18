import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()//loads my .env file in process.env

if (!process.env.CONNECTION_STRING) {
    throw new Error('CONNECTION_STRING is not defined in .env')
  }

export const supabase = new Pool({
    connectionString: process.env.CONNECTION_STRING
})