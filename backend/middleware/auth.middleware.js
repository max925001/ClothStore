import jwt from "jsonwebtoken"

const isLoggedIn = async (req ,res, next) =>{

     const {token} = req.cookies
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please login first"
        })
    }
   

const userDetails =  await jwt.verify(token,process.env.JWT_SECRET)
req.user = userDetails;
next()
}


const authorizedRoles = (...roles) => async(req,res,next)=>{
const currentUserRole = req.user.role
if(!roles.includes(currentUserRole)){
return res.status(403).json({
    success:false,
    message:"You don't have permission to access this resource"
})

}
next()

}

export{
    isLoggedIn    
    ,authorizedRoles 
}