import { connection } from "../core/database.js";

class Draw {
    constructor() {
        this.connection = connection;
    }

    /**
     * Generate a winning number and save it to the database.
     * @returns {Promise<string>} - The winning number.
     */
    async generateWinningNumber() {
        try {
            // Generate a random winning number (e.g., "12-34-56-78-90-12")
            const winningNumber = Array.from({ length: 6 }, () =>
                Math.floor(Math.random() * 46)
                    .toString()
                    .padStart(2, "0")
            ).join("-");

            // Save the winning number to the database
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
     * Get the results of the last draw.
     * @returns {Promise<Object>} - The last draw results.
     */
    async getLastDraw() {
        try {
            const [lastDraw] = await this.connection.execute(
                "SELECT * FROM last_draw ORDER BY created_at DESC LIMIT 1"
            );

            if (lastDraw.length === 0) {
                throw new Error("No draw has been conducted yet");
            }

            return lastDraw[0];
        } catch (err) {
            console.error("<error> draw.getLastDraw", err);
            throw err;
        }
    }
}

export default Draw;