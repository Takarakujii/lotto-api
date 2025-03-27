import Pot from "../../models/pot.js";

class PotController {
    constructor() {
        this.pot = new Pot();
    }

    /**
     * Get the current pot amount.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getPot(req, res) {
        try {console.log('Get pot amount request received');
console.log('Update pot amount request received');
console.log('Roll over pot request received');
            const potAmount = await this.pot.getPot();

            res.status(200).send({
                success: true,
                potAmount,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Update the pot amount.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async updatePot(req, res) {
        try {
            const { amount } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).send({
                    success: false,
                    message: "Amount must be greater than 0",
                });
            }

            const result = await this.pot.updatePot(amount);

            res.status(200).send({
                success: true,
                message: "Pot updated successfully",
                data: result,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Roll over the pot if there is no winner.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async rollOverPot(req, res) {
        try {
            const result = await this.pot.rollOverPot();

            res.status(200).send({
                success: true,
                message: "Pot rolled over successfully",
                data: result,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default PotController;