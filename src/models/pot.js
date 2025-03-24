import { connection } from "../core/database.js";

class Pot {
    constructor() {
        this.connection = connection;
    }

    /**
     * Get the current pot amount.
     * @returns {Promise<number>} - The current pot amount.
     */
    async getPot() {
        try {
            const [pot] = await this.connection.execute(
                "SELECT pot_amount FROM pot WHERE pot_id = 1"
            );

            if (pot.length === 0) {
                throw new Error("Pot not found");
            }

            return pot[0].pot_amount;
        } catch (err) {
            console.error("<error> pot.getPot", err);
            throw err;
        }
    }

    /**
     * Update the pot amount.
     * @param {number} amount - The amount to add to the pot.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async updatePot(amount) {
        try {
            const [result] = await this.connection.execute(
                "UPDATE pot SET pot_amount = pot_amount + ? WHERE pot_id = 1",
                [amount]
            );

            if (result.affectedRows === 0) {
                throw new Error("Pot not found");
            }

            return result;
        } catch (err) {
            console.error("<error> pot.updatePot", err);
            throw err;
        }
    }

    /**
     * Roll over the pot if there is no winner.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async rollOverPot() {
        try {
            // Check if there are any winners in the last draw
            const [lastDraw] = await this.connection.execute(
                "SELECT winning_number FROM last_draw ORDER BY created_at DESC LIMIT 1"
            );

            if (lastDraw.length === 0) {
                throw new Error("No draw has been conducted yet");
            }

            const winningNumber = lastDraw[0].winning_number;

            const [winningBets] = await this.connection.execute(
                "SELECT * FROM bets WHERE bet_number = ?",
                [winningNumber]
            );

            if (winningBets.length > 0) {
                throw new Error("Cannot roll over pot: There are winners in the last draw");
            }

            // Roll over the pot by keeping the current amount
            const [result] = await this.connection.execute(
                "UPDATE pot SET pot_amount = pot_amount WHERE pot_id = 1"
            );

            if (result.affectedRows === 0) {
                throw new Error("Pot not found");
            }

            return result;
        } catch (err) {
            console.error("<error> pot.rollOverPot", err);
            throw err;
        }
    }
}

export default Pot;