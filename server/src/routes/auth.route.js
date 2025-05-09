import express from "express";
import { signupUser, loginUser, logoutUser} from "../controllers/auth.controller.js";
import { loginAndSignupLimiter } from "../middlewares/rateLimit.js";
const router = express.Router();

router.post("/signup", loginAndSignupLimiter, signupUser);

router.post('/login',loginAndSignupLimiter, loginUser);
  
router.post("/logout", logoutUser);


export default router;