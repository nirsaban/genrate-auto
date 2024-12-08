import { InstagramWebhookPayload } from "../types/instagram";
import { logInfo } from "../utils/logger";

export function handleWebhookEvent(payload: InstagramWebhookPayload) {
    payload.entry.forEach((entry) => {
        entry.changes.forEach((change) => {
            if (change.field === "comments") {
                logInfo("New Comment Event", change.value);
                // Handle comment event logic
            } else if (change.field === "likes") {
                logInfo("New Like Event", change.value);
                // Handle like event logic
            }
        });
    });
}