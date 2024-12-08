import express, { Request, Response } from "express";
import { handleWebhookEvent } from "../services/webhook.service";
import { validateWebhook } from "../middlewares/validateRequest";
import { InstagramWebhookPayload } from "../types/instagram";

const router = express.Router();

// Webhook verification
router.get("/", validateWebhook, (req: Request, res: Response) => {
    const challenge = req.query["hub.challenge"];
    res.status(200).send(challenge);
});

// Webhook handler
router.post("/", (req: Request, res: Response) => {
    const payload = req.body as InstagramWebhookPayload;
    handleWebhookEvent(payload);
    res.sendStatus(200);
});

export default router;