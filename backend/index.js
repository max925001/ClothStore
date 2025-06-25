import { config } from 'dotenv'
config()
import express from 'express'
import connectToDb from './config/db.js'
import authrouter from './routes/user.route.js'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import clothrouter from './routes/cloths.route.js'
import axios from 'axios'

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

const url = "https://clothstore-v65v.onrender.com/ping"
const interval = 300000;
function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.get('/ping', (req, res) => {
    res.send('pong')
})

app.use('/api/v1/user',authrouter)
app.use('/api/v1/cloth',clothrouter)


app.listen(PORT, () => {
    console.log(`Server is  listening on port ${PORT}`)
})