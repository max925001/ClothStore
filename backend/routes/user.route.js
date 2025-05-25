import { Router } from "express";
import { getProfile, login, logout, register, updateUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const authrouter = Router()

authrouter.post('/register' ,register )
authrouter.post('/login' ,login)
authrouter.post('/logout' ,logout)
authrouter.get('/getuserdetails',isLoggedIn,getProfile)
authrouter.put('/updateuserdetails',isLoggedIn, upload.single('image'), updateUser)




export default authrouter

