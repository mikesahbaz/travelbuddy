import express, { Express } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

require('dotenv').config();

const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.json());
app.use('/users',userRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})