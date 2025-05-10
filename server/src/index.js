import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';


import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import { globalLimiter } from './middlewares/rateLimit.js';
import config from './lib/config/config.js';
import { connectDB } from './lib/config/db.js';
import passport from './lib/config/passport/index.js';

import authRoutes from './routes/auth.route.js';
import logsRoutes from './routes/logs.route.js';

// Initialization
const app = express();

// Security 
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'code.jquery.com'],
    imgSrc: ["'self'", 'res.cloudinary.com'],
    connectSrc: ["'self'", config.CLIENT_URL || 'http://localhost:5173'],
  },
}));

// Logging
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'common'));


// CORS 
app.use(cors({
  origin: config.CLIENT_URL || 'http://localhost:5173',
  credentials: true, 
}));

// Core middlewares
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));


// Sanitize
// Middleware to make sanitized inputs available in route handlers
const applySanitizedInputs = (req, res, next) => {
  const originalQuery = req.query;
  const originalBody = req.body;
  const originalParams = req.params;
  
  // Create sanitized versions
  const sanitizedQuery = mongoSanitize.sanitize(req.query);
  const sanitizedBody = mongoSanitize.sanitize(req.body);
  const sanitizedParams = mongoSanitize.sanitize(req.params);
  
  // Keep original versions accessible
  req.originalQuery = originalQuery;
  req.originalBody = originalBody;
  req.originalParams = originalParams;
  
  // Make sanitized versions available
  req.sanitizedQuery = sanitizedQuery;
  req.sanitizedBody = sanitizedBody;
  req.sanitizedParams = sanitizedParams;
  
  // Optional: Log sanitization events if values were changed
  next();
};

app.use(applySanitizedInputs);
app.use(xss());


// Passport
app.use(passport.initialize());

//Global rate limiter
app.use('/api/', globalLimiter);

//Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/logs', logsRoutes);


app.use(notFound);
app.use(errorHandler);


const port = config.PORT || 4000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1); 
});
