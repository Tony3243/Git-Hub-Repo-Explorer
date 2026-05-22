import dotenv from 'dotenv'
dotenv.config()//loads my .env file in process.env
import { Pool } from 'pg'


if (!process.env.CONNECTION_STRING) {
    console.log("CONNECTION_STRING INVALID")
    throw new Error('CONNECTION_STRING is not defined in .env')
  }


export const supabase = new Pool({
    connectionString: process.env.CONNECTION_STRING,
    ssl: {
      rejectUnauthorized: false
    }
})

supabase.connect((err, client, release) => {
  if(err) {
    console.error('❌ Connection failed:', err.message)
  } else {
    console.log('✅ Database connected!')
    release()
  }
})


