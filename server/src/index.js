import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import config from './lib/config/config.js';
import { connectDB } from './lib/config/db.js';

// Initialization
const app = express();

app.use(express.json());
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.use(notFound);
app.use(errorHandler);

const port = config.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  connectDB();
});
