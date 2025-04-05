import { connection } from "../core/database.js";

class WinResult {
    constructor() {
        this.connection = connection;
    }

    /**
     * Get the winning history for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<Array>} - The user's winning history.
     */
    async getWinningHistory(userId) {
        try {
            const [winningHistory] = await this.connection.execute(
               `SELECT 
                    ld.winning_number, 
                    wr.winning_prize,  -- Fetch winning_prize from winresult
                    ld.created_at, 
                    u.username
                 FROM bets b
                 JOIN draw ld ON b.draw_id = ld.draw_id
                 JOIN users u ON b.user_id = u.user_id
                 JOIN win_result wr ON wr.bet_id = b.bet_id -- Link winresult to bets
                 WHERE b.user_id = ?
                 ORDER BY ld.created_at DESC`,  // Sorting by most recent draws
                [userId]
            );
    
            return winningHistory;
        } catch (err) {
            console.error("<e> winResult.getWinningHistory", err);
            throw err;
        }
    }

    /**
     * Get all users who have won.
     * @returns {Promise<Array>} - All users who have won with their winning details.
     */
    async getAllWinners() {
        try {
            const [winners] = await this.connection.execute(
               `SELECT 
                    u.user_id,
                    u.username,
                    ld.winning_number, 
                    wr.winning_prize,
                    ld.created_at
                 FROM win_result wr
                 JOIN bets b ON wr.bet_id = b.bet_id
                 JOIN users u ON b.user_id = u.user_id
                 JOIN draw ld ON b.draw_id = ld.draw_id
                 ORDER BY ld.created_at DESC`
            );
    
            return winners;
        } catch (err) {
            console.error("<e> winResult.getAllWinners", err);
            throw err;
        }
    }
}
    
export default WinResult;
