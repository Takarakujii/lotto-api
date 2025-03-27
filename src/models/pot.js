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
                "SELECT pot_amount FROM pot"
            );
            return pot?.[0]?.pot_amount || 100000; // Modified to match Sample 1's default
        } catch (err) {
            console.error("<error> pot.getPot", err);
            throw err;
        }
    }

    /**
     * Update the pot amount.
     * @param {number} amount - The amount to add to the pot.
     * @returns {Promise<number>} - The updated pot amount.
     */
    async updatePot(amount) {
        try {
            const [result] = await this.connection.execute(
                "SELECT pot_amount FROM pot ORDER BY pot_id DESC LIMIT 1"
            );

            let currentPot = result.length > 0 ? result[0].pot_amount : 100000;
            let updatedPot = currentPot + amount;    

            await this.connection.execute(
                "UPDATE pot SET pot_amount = ? WHERE pot_id = 1", // Simplified to use fixed ID like Sample 2
                [updatedPot]
            );
            return updatedPot;
        } catch (err) {
            console.error("<error> pot.updatePot", err);
            throw err;
        }
    }

    /**
     * Roll over the pot by adding user bets.
     * @param {number} userBets - The amount from user bets to add to pot.
     * @returns {Promise<Object>} - The result of the database operation.
     */
    async rollOverPot(userBets) {
        try {
            const [result] = await this.connection.execute(
                "UPDATE pot SET pot_amount = pot_amount + ? WHERE pot_id = 1",
                [userBets]
            );
            return result;
        } catch (err) {
            console.error("<error> pot.rollOverPot", err);
            throw err;
        }
    }
}

export default Pot;