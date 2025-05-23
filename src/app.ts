import express from 'express';
import globalErrorHandler from './middlewares/globalErrorsHandler';

const app= express();

app.get("/",(req,res,next)=>{

   // const error=createHttpError(400,"spam worng");
    //throw error;
    res.json({message: "hello user"});
});

app.use(globalErrorHandler);

export default app;