import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));

// to import routes 
import authRouter from './routes/authRoute.js';
import postRouter from './routes/postRoute.js';

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/posts',postRouter);

const PORT = 3030;
app.listen(PORT,async()=>{
    try {
     await mongoose.connect(process.env.MONGO_URL);
     console.log(`Server is running on the port ${PORT}`);
    } catch (error) {
        console.log('Server is not running',error);
        process.exit(1);
    }
})