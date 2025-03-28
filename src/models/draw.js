// models/draw.js
import { connection } from "../core/database.js";

class Draw {
    constructor() {
        this.connection = connection;
    }

    async distributePrizes(winningNumber, drawId) {
        try {
            // get the processed betss
            const [allBets] = await this.connection.execute(
                "SELECT bet_id, user_id, bet_amount, bet_number FROM bets WHERE draw_id IS NULL"
            );
    
            const winners = allBets
                .filter(bet => this.isExactMatch(bet.bet_number, winningNumber))
                .map(bet => bet.bet_id);
    
            //  Get current pot amount
            const [potResult] = await this.connection.execute(
                "SELECT pot_amount FROM pot WHERE pot_id = 1"
            );
            const potAmount = potResult[0].pot_amount;
    
            // if there are winners hehe
            if (winners.length > 0) {
                const prizePerWinner = potAmount / winners.length;
                
                // Update the balance of the sers who wong
                for (const betId of winners) {
                    const [bet] = await this.connection.execute(
                        "SELECT user_id FROM bets WHERE bet_id = ?", 
                        [betId]
                    );
                    
                    if (bet.length > 0) {
                        await this.connection.execute(
                            "UPDATE users SET user_balance = user_balance + ? WHERE user_id = ?",
                            [prizePerWinner, bet[0].user_id]
                        );
                    }
                }
    
                // Record winning results
                for (const betId of winners) {
                    await this.connection.execute(
                        await this.connection.execute(
                            "INSERT INTO win_result (bet_id, user_id, winning_prize) VALUES (?, ?, ?)",
                            [betId, bet[0].user_id, prizePerWinner]  
                        ));
                    }
                
    
                // Reset the pot
                await this.connection.execute(
                    "UPDATE pot SET pot_amount = 0 WHERE pot_id = 1"
                );
            }
    
            await this.connection.execute(
                "UPDATE bets SET draw_id = ? WHERE draw_id IS NULL",
                [drawId]
            );
    
            return {
                totalWinners: winners.length,
                potAmount,
                prizePerWinner: winners.length > 0 ? potAmount / winners.length : 0
            };
        } catch (err) {
            console.error("Prize distribution error:", err);
            throw err;
        }
    }




    async generateWinningNumber() {
        try {
            const numbers = new Set();
            
            while (numbers.size < 6) {
                const num = Math.floor(Math.random() * 47) + 1;
                numbers.add(num);
            }
            
            const winningNumber = Array.from(numbers)
            .map(n => n.toString().padStart(2, "0"))
            .join("-");

           /* const winningNumber = "11-23-42-22-33-44"*/
            
           
            const [drawResult] = await this.connection.execute(
                "INSERT INTO draw (winning_number) VALUES (?)",
                [winningNumber]
            );
            const drawId = drawResult.insertId;

            const distributionResult = await this.distributePrizes(winningNumber, drawId);
            
           

            return {
                winningNumber,
                distributionResult
            };
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
        // Get the MOST recent draw (remove the LIMIT 1,1 offset)
        const [lastDraws] = await this.connection.execute(
            `SELECT ld.*, p.pot_amount 
             FROM draw ld
             LEFT JOIN pot p ON 1=1
             ORDER BY ld.created_at DESC 
             LIMIT 1`  // Changed from LIMIT 1,1 to just LIMIT 1
        );

        if (lastDraws.length === 0) {
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