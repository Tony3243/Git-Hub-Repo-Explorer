//validates if environment variables exist before starting server
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.JWT_TOKEN || !process.env.REFRESH_TOKEN) {
    throw new Error("JWT_TOKEN and REFRESH_TOKEN must be defined in the environment variables");
}

export const variables = {
    jwtToken: process.env.JWT_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN
}