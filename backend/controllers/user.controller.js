import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const cookieOptions = {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite:'None',
    secure: true

}
export const register = async (req,res) =>{

const {fullname,email,password} = req.body

try {

    if(!fullname || !email || !password){
        return res.status(400).json({ success:false,message:"All fields are required"})
    }
    if(fullname.length<3 && fullname.length>100){
        return res.status(400).json({ success:false,message:"Fullname must be between 3 and 100 characters"})
    }
    if(password.length < 6){
        return res.status(400).json({ success:false,message:"Password must be at least 6 characters"})
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return res.status(400).json({ success:false,message:"Email already exists"})
    }

    if(password.length < 6){
        return res.status(400).json({ success:false,message:"Password must be at least 6 characters"})
    }
    

    const user = await User.create({fullname,email,password})

    const token = await user.generateJWTtoken()
    res.cookie('token' ,token ,cookieOptions)

     return res.status(201).json({success:true,message:"User created successfully",user})


} catch (error) {
    
    return res.status(500).json({ success:false,message:"Something went wrong"})
}



}


export const login = async (req,res) =>{

const {email,password} =req.body

try {

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    const user =  await User.findOne({email}).select("+password")
   


    if (!user) {
    return res.status(400).json({
        success:false,
        message:"Invalid username or password"
    })}

const isPasswordMatch = await user.comparePassword(password)

  if (!isPasswordMatch) {
    return res.status(400).json({
        success:false,
        message:"Invalid username or password"
    })
  }
user.password=undefined
  const token = await user.generateJWTtoken()
  res.cookie('token' ,token ,cookieOptions)
  res.status(200).json({
    success:true,
    message:"User logged in successfully",
    user
  })
  
    
} catch (error) {
    
    return res.status(500).json({ success:false,message:"Something went wrong"})
    
}

} 


 export const logout = (req,res) =>{

res.cookie('token' ,null ,{
    secure:true,
    maxAge:0,
    httpOnly:true
})

res.status(200).json({
    success:true,
    message:'User Logout Successfully'

})

}

export const updateUser = async (req ,res ,next) =>{

  
const {id} = req.user
const user = await User.findByIdAndUpdate(id)


if(!user){
return res.status(400).json({
    success:false ,
    message:"User not found"
})


}


const userProfile = req.file

if(!userProfile){
    return res.status(400).json({
        success:false ,
        message:"Please upload a profile picture"
    })
}

try {
    if(userProfile){

const result = await uploadOnCloudinary(userProfile)
if(!result){
    return res.status(400).json({
        success:false ,
        message:"Failed to upload image"
    })
}

    user.avatar.public_id = result.public_id
    user.avatar.secure_url =result.secure_url

    
await user.save()

res.status(200).json({
    success:true,
    message:'Profile photo changes successfully',
    user
})

}
} catch (error) {
    console.log(error)
    
}

}


 export const getProfile =  async(req,res,next) =>{

    const userId = req.user.id;
try{
    
const user = await User.findById(userId)
if(!user){
    return res.status(404).json({ success:false,message:"User not found"})
}
res.status(200).json({
    success:true,
    message:'user details',
    user
})
}catch(e){
return res.status(500).json({ success:false,message:"Something went wrong"})

}

}