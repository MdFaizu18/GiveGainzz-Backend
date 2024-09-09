import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));

// to import routes 
import authRouter from './routes/authRoute.js'

app.use('/api/v1/auth',authRouter);

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