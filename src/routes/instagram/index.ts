import express, {Request, Response} from "express";
import {InstagramWebhookPayload} from "../../types/instagram";
import {handleWebhookEvent} from "../../services/webhook.service";

const router = express.Router();


router.post("/raffeleLeadSubscription", (req: Request, res: Response) => {
    const payload = req.body as InstagramWebhookPayload;
    console.log(payload)
    res.send(payload)
});


export default router