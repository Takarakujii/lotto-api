// models/bet.js
import { connection } from "../core/database.js";

class Bet {
    constructor() {
        this.app = connection;
    }

    /**
     * Place a bet by deducting the bet amount from the user's wallet
     * and inserting a new bet record with the bet number and round.
     *
     * @param {number} userId - The ID of the user.
     * @param {number} betAmount - The amount the user is betting.
     * @param {string} betNumber - The bet number in the format "xx-xx-xx-xx-xx-xx".
     * @param {number} roundId - The current round identifier.
     * @returns {Promise<Object>} - The result of the insertion.
     */
    async placeBet(userId, betAmount, betNumber, roundId) {
        try {
            // Deduct the bet amount from the user's wallet if sufficient funds exist.
            const [updateResult] = await this.app.execute(
                "UPDATE users SET user_balance = user_balance - ? WHERE user_id = ? AND user_balance >= ?",
                [betAmount, userId, betAmount]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error("Insufficient wallet balance or user not found");
            }

            // Insert the bet record including the bet number and round.
            const [insertResult] = await this.app.execute(
                "INSERT INTO bets (user_id, bet_amount, bet_number, round_id) VALUES (?, ?, ?, ?)",
                [userId, betAmount, betNumber, roundId]
            );

            return insertResult;
        } catch (err) {
            console.error("<error> bet.placeBet", err);
            throw err;
        }
    }
}

export default Bet;
