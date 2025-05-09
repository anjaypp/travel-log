import rateLimit from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Max 100 requests per hour
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false
});

const loginAndSignupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per minute
  message:
    "Too many login attempts from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false
});

const logCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 requests per hour
  message:
    "Too many log creation attempts from this IP, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false
});
const logOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message:
    "Too many log update or delete attempts from this IP, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false
});

export { globalLimiter, loginAndSignupLimiter, logCreateLimiter, logOperationLimiter };
