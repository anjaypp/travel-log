import express from "express";
import { createTravelLog, getAllTravelLogs, getTravelLogById, updateTravelLog, deleteTravelLog } from "../controllers/logs.controller.js";
import passport from "../lib/config/passport/index.js";
import { handleFileUpload } from "../middlewares/fileUpload.js";
import { logCreateLimiter, logOperationLimiter } from "../middlewares/rateLimit.js";
const router = express.Router();

router.post('/', logCreateLimiter, handleFileUpload, passport.authenticate('jwt', { session: false }), createTravelLog);
router.get('/', passport.authenticate('jwt', { session: false }), getAllTravelLogs);
router.get('/:id', passport.authenticate('jwt', { session: false }), getTravelLogById);
router.put('/:id', logOperationLimiter, handleFileUpload, passport.authenticate('jwt', { session: false }), updateTravelLog);
router.delete('/:id', logOperationLimiter, passport.authenticate('jwt', { session: false }), deleteTravelLog);


export default router;
