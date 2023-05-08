import express, { Express } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';
//import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/trips', tripRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

export default app;