import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';


import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import config from './lib/config/config.js';
import { connectDB } from './lib/config/db.js';
import passport from './lib/config/passport/index.js';

import authRoutes from './routes/auth.route.js';
import logsRoutes from './routes/logs.route.js';

// Initialization
const app = express();

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security and logging
app.use(morgan('common'));
app.use(helmet());

// CORS 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));


// Passport
app.use(passport.initialize());

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/logs', logsRoutes);


app.use(notFound);
app.use(errorHandler);


const port = config.PORT;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1); 
});
