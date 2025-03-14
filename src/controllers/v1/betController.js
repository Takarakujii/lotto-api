// controller/v1/betController.js
import Bet from "../../models/Bet.js";

class BetController {
    constructor() {
        this.bet = new Bet();
    }

    async placeBet(req, res) {
        try {
            const { betAmount, betNumber } = req.body || {};
            const userId = res.locals.user_id; // Extracted from authentication middleware

            if (!betAmount || betAmount <= 0) {
                return res.send({
                    success: false,
                    message: "Invalid bet amount",
                });
            }

            if (!betNumber) {
                return res.send({
                    success: false,
                    message: "Bet number is required",
                });
            }

            // Validate bet number format "xx-xx-xx-xx-xx-xx"
            const betNumberRegex = /^[0-9]{2}(?:-[0-9]{2}){5}$/;
            if (!betNumberRegex.test(betNumber)) {
                return res.send({
                    success: false,
                    message: "Invalid bet number format. Expected format: xx-xx-xx-xx-xx-xx (e.g., 12-34-56-78-90-12)",
                });
            }

            // Retrieve the current round ID.
            // If not set, return an error instead of passing undefined.
            const currentRoundId = global.currentRoundId;
            if (!currentRoundId) {
                return res.send({
                    success: false,
                    message: "No active round. Please try again later.",
                });
            }

            const result = await this.bet.placeBet(userId, betAmount, betNumber, currentRoundId);

            res.send({
                success: true,
                message: "Bet placed successfully",
                result,
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
