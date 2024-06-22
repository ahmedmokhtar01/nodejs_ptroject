// here you will wrtie express functions
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import router from './routers'
import *as  dotenv from 'dotenv'
import { protect } from './moudules/auth'
import { createNewUser, signIn } from './handlers/user'
import { Request, Response } from 'express';


const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// the root of application
app.get('/', (req: Request, res: Response) => {
    console.log("get request")
    res.status(200);
    res.send("hello user ")

})

app.use('/api', protect, router)
app.post('/user', createNewUser)
app.post('/signin', signIn)

//this is import for typeScript
export default app