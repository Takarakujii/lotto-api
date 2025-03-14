// routes/betRoutes.js
import { Router } from "express";
import BetController from "../../controllers/v1/betController.js";
import authentication from "../../middlewares/authentication.js";

const betRouter = new Router();
const bet = new BetController();

// Apply authentication middleware
// POST /bet { "betAmount": 50 }
betRouter.post("/", authentication, bet.placeBet.bind(bet));

export default betRouter;
