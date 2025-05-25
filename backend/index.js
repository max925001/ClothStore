import { config } from 'dotenv'
config()
import express from 'express'
import connectToDb from './config/db.js'
import authrouter from './routes/user.route.js'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bookrouter from './routes/book.route.js'

const app = express()
const PORT = process.env.PORT || 5001
connectToDb()

app.use(express.json()) //use for paras
app.use(express.urlencoded({
    extended:true
}))


app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cookie'],

}))

app.use(cookieParser())

app.use(morgan('dev'))

app.use('/api/v1/user',authrouter)
app.use('/api/v1/book',bookrouter)


app.listen(PORT, () => {
    console.log(`Server is  listening on port ${PORT}`)
})