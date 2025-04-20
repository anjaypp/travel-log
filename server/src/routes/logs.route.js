import express from "express";
import { createTravelLog, getAllTravelLogs, getTravelLogById, updateTravelLog, deleteTravelLog } from "../controllers/logs.controller.js";
import passport from "../lib/config/passport/index.js";
const router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), createTravelLog);
router.get('/', passport.authenticate('jwt', { session: false }), getAllTravelLogs);
router.get('/:id', passport.authenticate('jwt', { session: false }), getTravelLogById);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateTravelLog);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteTravelLog);


export default router;
