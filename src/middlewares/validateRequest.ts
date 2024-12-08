import { Request, Response, NextFunction } from "express";
import CONFIG from "../config/config";

export function validateWebhook(req: Request, res: Response, next: NextFunction) {
    const token = req.query["hub.verify_token"];
    if (token === CONFIG.VERIFY_TOKEN) {
        next();
    } else {
        res.status(403).send("Forbidden");
    }
}