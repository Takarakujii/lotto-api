// models/draw.js
import { connection } from "../core/database.js";

class Draw {
    constructor() {
        this.connection = connection;
    }

    /**
     * Generate 6 unique winning numbers between 1-47 in xx-xx-xx-xx-xx-xx format
     * @returns {Promise<string>} - The winning number string
     */
    async generateWinningNumber() {
        try {
            const numbers = new Set();
            
            // Generate 6 unique numbers between 1-47
            while (numbers.size < 6) {
                const num = Math.floor(Math.random() * 47) + 1;
                numbers.add(num);
            }
            
            // Format as two-digit strings and join
            const winningNumber = Array.from(numbers)
                .map(n => n.toString().padStart(2, "0"))
                .join("-");

            // Save to database
            await this.connection.execute(
                "INSERT INTO last_draw (winning_number) VALUES (?)",
                [winningNumber]
            );

            return winningNumber;
        } catch (err) {
            console.error("<error> draw.generateWinningNumber", err);
            throw err;
        }
    }

    /**
     * Get the last draw results with pot information
     * @returns {Promise<Object>} - The draw results with pot
     */
    async getLastDraw() {
        try {
            // Get the second most recent draw (since the most recent is the current one)
            const [lastDraws] = await this.connection.execute(
                `SELECT ld.*, p.pot_amount 
                 FROM last_draw ld
                 LEFT JOIN pot p ON 1=1
                 ORDER BY ld.created_at DESC 
                 LIMIT 1, 1`  // Skip first row (current draw), get second row (previous draw)
            );
    
            if (lastDraws.length === 0) {
                // If no previous draw exists, return empty/default values
                return {
                    winning_number: '00-00-00-00-00-00',
                    pot_amount: 0,
                    created_at: new Date(0)
                };
            }
    
            return lastDraws[0];
        } catch (err) {
            console.error("<error> draw.getLastDraw", err);
            throw err;
        }
    }

    /**
     * Check if a bet matches the winning numbers exactly
     * @param {string} betNumber - The user's bet number
     * @param {string} winningNumber - The drawn winning number
     * @returns {boolean} - True if exact match
     */
    isExactMatch(betNumber, winningNumber) {
        return betNumber === winningNumber;
    }
}

export default Draw;