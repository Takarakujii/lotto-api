// controllers/betController.js
import Bet from "../../models/bet.js";

class BetController {
    constructor() {
        this.bet = new Bet();
    }

    /**
     * Handle creating a new bet.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async createBet(req, res) {
        try {
            const { betAmount, betNumber } = req.body || {};
            const userId = res.locals.user_id; // Extracted from authentication middleware

            if (!betAmount || !betNumber) {
                return res.send({
                    success: false,
                    message: "Bet amount and number are required",
                });
            }

            if (betAmount <= 0) {
                return res.send({
                    success: false,
                    message: "Bet amount must be greater than 0",
                });
            }

            const result = await this.bet.createBet(userId, betAmount, betNumber);

            res.send({
                success: true,
                message: "Bet placed successfully",
                data: result,
            });
        } catch (err) {
            res.send({
                success: false,
                message: err.toString(),
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