// models/bet.js
import { connection } from "../core/database.js";

class Bet {
    constructor() {
        this.app = connection;
    }

    /**
     * Validate the bet number format (xx-xx-xx-xx-xx-xx).
     * @param {string} betNumber - The bet number to validate.
     * @returns {boolean} - True if the format is valid, otherwise false.
     */
    validateBetNumber(betNumber) {
        const regex = /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/;
        return regex.test(betNumber);
    }

    /**
     * Create a new bet and deduct the bet amount from the user's balance.
     * @param {number} userId - The ID of the user.
     * @param {number} betAmount - The amount of the bet.
     * @param {string} betNumber - The bet number (xx-xx-xx-xx-xx-xx).
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async createBet(userId, betAmount, betNumber) {
        try {
            // Validate bet number format
            if (!this.validateBetNumber(betNumber)) {
                throw new Error("Invalid bet number format. Expected format: xx-xx-xx-xx-xx-xx");
            }

            // Start a transaction to ensure atomicity
            await connection.beginTransaction();

            // Deduct the bet amount from the user's balance
            const [userUpdateResult] = await connection.execute(
                "UPDATE users SET user_balance = user_balance - ? WHERE user_id = ? AND user_balance >= ?",
                [betAmount, userId, betAmount]
            );

            if (userUpdateResult.affectedRows === 0) {
                throw new Error("Insufficient balance or user not found");
            }

            // Insert the new bet
            const [betInsertResult] = await connection.execute(
                "INSERT INTO bets (user_id, bet_amount, bet_number) VALUES (?, ?, ?)",
                [userId, betAmount, betNumber]
            );

            // Commit the transaction
            await connection.commit();

            return betInsertResult;
        } catch (err) {
            // Rollback the transaction in case of an error
            await connection.rollback();
            console.error("<error> bet.createBet", err);
            throw err;
        }
    }

    /**
     * Delete a bet by ID.
     * @param {number} betId - The ID of the bet.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async deleteBet(betId) {
        try {
            const [result] = await connection.execute(
                "DELETE FROM bets WHERE bet_id = ?",
                [betId]
            );

            if (result.affectedRows === 0) {
                throw new Error("Bet not found");
            }

            return result;
        } catch (err) {
            console.error("<error> bet.deleteBet", err);
            throw err;
        }
    }
}

export default Bet;