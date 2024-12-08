import express,{Request,Response} from "express";
import bodyParser from "body-parser";
import CONFIG from "./config/config";
import webhookRoutes from "./routes/webhook.routes";
import instagramRoutes from "./routes/instagram/index"
import { logInfo } from "./utils/logger";

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/webhook", webhookRoutes);
app.use("/instagram", instagramRoutes);

app.get("/", (req: Request, res: Response) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === 'nirTokenTest') {
        console.log("Webhook verified!");
        // Respond with the challenge sent by Facebook
        res.status(200).send(challenge);
    } else {
        console.error("Verification failed. Tokens do not match.");
        res.sendStatus(403);
    }
});
// Start server
app.listen(CONFIG.PORT, () => {
    logInfo(`Server is running on port ${CONFIG.PORT}`);
});