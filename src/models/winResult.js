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
                "SELECT * FROM win_result WHERE user_id = ?",
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