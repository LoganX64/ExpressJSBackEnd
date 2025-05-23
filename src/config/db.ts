
import mongoose from 'mongoose';
import { config } from './config';


const connectDB = async () => {
try {
    mongoose.connection.on('connected',()=>{
        console.log("connection to DB successful");
    });

    mongoose.connection.on("error",(error)=>{

        console.log("error in connection to database.",error);
    });

    await mongoose.connect(config.databaseUrl as string);
    
} catch (err) {
    console.error("failed to connect",err);

    process.exit(1);
}

    
   
};

export default connectDB;