import { config as conf } from "dotenv";


conf();
const _config={
    port:process.env.PORT,
    
    databaseUrl: process.env.MONGO_CONNECTION_STRING,

    env:process.env.NODE_ENV,
    
    jwtSecret:process.env.JWT_SECRET,

    cloudinaryCloud:process.env.CLOUDINARY_CLOUD,

    cloudinaryAPIkey:process.env.CLOUDINARY_API_KEY,
    
    cloudinarySecret:process.env.CLOUDINARY_API_SECRET,

    frontendDomain :process.env.FRONT_END_DOMAIN

};

export const config = Object.freeze(_config);