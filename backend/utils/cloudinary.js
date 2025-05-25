import { config } from 'dotenv'
config();
import {v2 as cloudinary }from 'cloudinary'

import fs from 'fs'

cloudinary.config({

cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET

})

const uploadOnCloudinary = async (localFilePath) =>{

try{
if(!localFilePath){
    return null



}
//upload file on cloudinary

 const response =await cloudinary.uploader.upload(localFilePath.path,{
    resource_type:"auto"
 })

console.log("response" ,response)
//file upload success full


fs.unlinkSync(localFilePath.path)
return response

}catch(error){

    fs.unlinkSync(localFilePath.path) //remove the locally saved temporary file as the upload operatio got failed
return null


}
}

export {uploadOnCloudinary}