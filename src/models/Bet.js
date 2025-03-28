// models/bet.js
import { connection } from "../core/database.js";

class Bet {
    constructor() {
        this.connection = connection;
    }

    /**
     * Validate 6 unique numbers between 1-47 in xx-xx-xx-xx-xx-xx format
     * @param {string} betNumber - The bet number to validate
     * @returns {boolean} - True if valid
     */
    validateBetNumber(betNumber) {
        const parts = betNumber.split('-');
        if (parts.length !== 6) return false;
        
        const numbers = new Set();
        for (const numStr of parts) {
            const num = parseInt(numStr, 10);
            if (isNaN(num) || num < 1 || num > 47) return false;
            if (numbers.has(num)) return false; // No duplicates
            numbers.add(num);
        }
        return true;
    }

    /**
     * Create a new bet
     * @param {number} userId - The user ID
     * @param {number} betAmount - The bet amount
     * @param {string} betNumber - The bet numbers
     * @returns {Promise<Object>} - The created bet
     */
    async createBet(userId, betAmount, betNumber) {
        try {
            if (!this.validateBetNumber(betNumber)) {
                throw new Error("Invalid bet format. Requires 6 unique numbers (1-47) in xx-xx-xx-xx-xx-xx format");
            }

            await this.connection.beginTransaction();

            // 1. Deduct from user balance
            const [userUpdate] = await this.connection.execute(
                "UPDATE users SET user_balance = user_balance - ? WHERE user_id = ? AND user_balance >= ?",
                [betAmount, userId, betAmount]
            );

            if (userUpdate.affectedRows === 0) {
                throw new Error("Insufficient balance or user not found");
            }

            // 2. Add to pot (100% of bet amount)
            await this.connection.execute(
                "UPDATE pot SET pot_amount = pot_amount + ? WHERE pot_id = 1",
                [betAmount]
            );

            // 3. Create the bet
            const [result] = await this.connection.execute(
                "INSERT INTO bets (user_id, bet_amount, bet_number) VALUES (?, ?, ?)",
                [userId, betAmount, betNumber]
            );

            await this.connection.commit();
            return result;
        } catch (err) {
            await this.connection.rollback();
            console.error("<error> bet.createBet", err);
            throw err;
        }
    }

    /**
     * Get all bets for a user
     * @param {number} userId - The user ID
     * @returns {Promise<Array>} - Array of bets
     */
    async getUserBets(userId) {
        try {
            const [bets] = await this.connection.execute(
                `SELECT b.*, ld.winning_number, wr.winning_prize 
                 FROM bets b
                 LEFT JOIN last_draw ld ON b.last_draw_id = ld.last_draw_id
                 LEFT JOIN win_result wr ON b.bet_id = wr.bet_id
                 WHERE b.user_id = ?
                 ORDER BY b.created_at DESC`,
                [userId]
            );
            return bets;
        } catch (err) {
            console.error("<error> bet.getUserBets", err);
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