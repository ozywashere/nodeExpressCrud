import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from './routes/tourRoutes.js';
import connectDB from './config/connectDB.js';

dotenv.config({ path: './.env' });
const app = express();

// middleWares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

//routes
app.get('/', (req, res) => {
  res.send('Hello from server side');
});

//
app.use('/api/v1/tours', userRoutes);
// connect to database

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
  connectDB();
});
