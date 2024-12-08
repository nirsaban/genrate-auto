export interface InstagramChange {
    field: "comments" | "likes";
    value: any; // Extend based on Instagram's API payload
}

export interface InstagramWebhookPayload {
    object: "instagram";
    entry: {
        id: string;
        changes: InstagramChange[];
    }[];
}