import { config } from "dotenv";
config();
import mongoose from "mongoose";
mongoose.set('strictQuery' ,false)
const MONGODB_URL =process.env.MONGO_URI

const connectToDb = async () =>{
    try{
 const {connection}= await mongoose.connect(MONGODB_URL)

if(connection){
    console.log(`MongoDb connected succesfully ${connection.host}`)
}

    }catch(e){

        console.log(e)
        process.exit(1)
    }


}

export default connectToDb