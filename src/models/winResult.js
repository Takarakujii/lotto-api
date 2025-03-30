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
                    b.bet_amount AS winning_prize, 
                    ld.created_at, 
                    u.username
                 FROM bets b
                 JOIN draw ld ON b.draw_id = ld.draw_id
                 JOIN users u ON b.user_id = u.user_id
                 WHERE b.user_id = ?
                 ORDER BY ld.created_at DESC`,  // Sorting by most recent draws
                [userId]
            );
    
            return winningHistory;
        } catch (err) {
            console.error("<error> winResult.getWinningHistory", err);
            throw err;
        }
    }
}
    
export default WinResult;
