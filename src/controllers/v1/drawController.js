import Draw from "../../models/draw.js";

class DrawController {
    constructor() {
        this.draw = new Draw();
    }

    /**
     * Generate a winning number.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async generateWinningNumber(req, res) {
        try {
            const winningNumber = await this.draw.generateWinningNumber();

            res.status(200).send({
                success: true,
                message: "Winning number generated",
                winningNumber,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }

    /**
     * Get the results of the last draw.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     */
    async getLastDraw(req, res) {
        try {
            const lastDraw = await this.draw.getLastDraw();

            res.status(200).send({
                success: true,
                lastDraw,
            });
        } catch (err) {
            res.status(500).send({
                success: false,
                message: err.toString(),
            });
        }
    }
}

export default DrawController;