import express, { Express } from 'express';
import dotenv from 'dotenv';
// import router from './router';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
app.use(express.json());


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})