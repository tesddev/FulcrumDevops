import express from "express"
import config from "./config.js";
import dbConnection from "./db/dbConnection.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/userManagement.js";
import cors from "cors"
import adminRouter from "./routes/admin.js";
import productRouter from "./routes/product.js";

const app = express();

app.use(express.json());
app.use(cors())

//Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/product', productRouter);

dbConnection()
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})