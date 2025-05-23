import express from 'express';
import globalErrorHandler from './middlewares/globalErrorsHandler';
import userRouter from './users/userRouter';
import restaurantRouter from './restaurant/registerRestaurant/restaurantRouter';
import menuRouter from './restaurant/restaurantMenu/menuItemsRouter';
import adminRouter from './adminUser/adminRoutes';
import orderRouter from './orders/orderRouter';
import cors from 'cors';
import { config } from './config/config';

const app = express();

app.use(express.json());

app.use(cors(
    {
        origin: config.frontendDomain,
    }
));
//routes 
app.get("/", (req, res) => {
    res.json({ message: "Welcome to RMS API" });
});
//user routes
app.use('/api/users', userRouter);

app.use("/api/admin", adminRouter);


app.use("/api/orders", orderRouter);

app.use("/api/restaurant", restaurantRouter);

app.use("/api/Menuitems", menuRouter)

app.use(globalErrorHandler);

export default app;