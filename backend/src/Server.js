import express from "express"

export class Server {
    constructor() {
        this.app = express();
    }

    setupRoutes() {
        this.app.get("/", (req, res) => {
            res.json({
                success: true
            })
        })
    }
}