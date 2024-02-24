import mongoose from "mongoose";
import Colors from "colors";
const connectDB = async()=>{
    try{
            const conn = await mongoose.connect(process.env.MONGO_URL);
            console.log(`connected to mongo db database ${conn.connection.host}`.bgMagenta.white)
     }
    catch(e){
        console.log(`error in MONGODB ${e}`.bgRed.white);
    }
}
export default connectDB