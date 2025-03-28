// controllers/betController.js
import Bet from "../../models/bet.js";

class BetController {
    constructor() {
        this.bet = new Bet();
    }

    /**
     * Create a new bet
     */
    async createBet(req, res) {
        try {
            const { betAmount, betNumber } = req.body;
            const userId = res.locals.user_id;

            if (!betAmount || !betNumber) {
                return res.status(400).send({
                    success: false,
                    message: "Bet amount and number are required"
                });
            }

            const result = await this.bet.createBet(userId, betAmount, betNumber);

            res.status(201).send({
                success: true,
                message: "Bet placed successfully",
                betId: result.insertId
            });
        } catch (err) {
            res.status(400).send({
                success: false,
                message: err.message
            });
        }
    }

    /**
     * Get all bets for the current user
     */
    async getUserBets(req, res) {
        try {
            const userId = res.locals.user_id;
            const bets = await this.bet.getUserBets(userId);

            res.status(200).send({
                success: true,
                data: bets
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.message
            });
        }
    }

    /**
     * Handle deleting a bet.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async deleteBet(req, res) {
        try {
            const { betId } = req.params;

            if (!betId) {
                return res.send({
                    success: false,
                    message: "Bet ID is required",
                });
            }

            const result = await this.bet.deleteBet(betId);

            res.send({
                success: true,
                message: "Bet deleted successfully",
                data: result,
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default BetController;