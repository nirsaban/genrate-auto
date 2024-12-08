export function logInfo(message: string, meta?: any) {
    console.log(`[INFO] ${message}`, meta || "");
}

export function logError(message: string, meta?: any) {
    console.error(`[ERROR] ${message}`, meta || "");
}