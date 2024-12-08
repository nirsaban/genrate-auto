import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

function delay(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function scrapeInstagramComments(postUrl: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    try {
        // Navigate to the Instagram post
        await page.goto(postUrl, { waitUntil: "networkidle2" });

        // Wait for the comments section to load
        await page.waitForSelector("article");

        let comments: { username: string; comment: string }[] = [];
        let hasMoreComments = true;

        while (hasMoreComments) {
            // Scrape currently visible comments
            const newComments = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("ul > ul > li"))
                    .map((comment) => {
                        const username = comment.querySelector("h3")?.innerText.trim();
                        const text = comment.querySelector("span")?.innerText.trim();
                        return username && text ? { username, comment: text } : null;
                    })
                    .filter(Boolean) as { username: string; comment: string }[];
            });

            // Add new unique comments
            comments = getUniqueByProperty([...comments, ...newComments], "username");

            console.log(`Comments scraped so far: ${comments.length}`);

            // Check if "Load more comments" button exists
            hasMoreComments = await page.evaluate(async () => {
                const buttons = Array.from(document.querySelectorAll("div[role='button']"));
                const loadMoreButton = buttons.find((button) =>
                    button.textContent?.includes("Load more comments")
                );

                if (loadMoreButton) {
                    (loadMoreButton as HTMLElement).click(); // Cast to HTMLElement to use .click()
                    return true; // Indicate that there are more comments to load
                }
                return false; // No more comments to load
            });

            if (hasMoreComments) {
                await delay(2000); // Wait for more comments to load
            }
        }

        return comments;
    } catch (error) {
        console.error("Error scraping comments:", error);
        return [];
    } finally {
        await browser.close();
    }
}

function downloadAsCSV(data: any[], filename = "instagram_comments.csv") {
    if (!Array.isArray(data) || data.length === 0) {
        console.error("Invalid data: Please provide a non-empty array of objects.");
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(","), // Add headers
        ...data.map((row) =>
            headers.map((header) => JSON.stringify(row[header] || "")).join(",")
        ), // Add rows
    ].join("\n");

    const filePath = path.resolve(__dirname, filename);
    fs.writeFileSync(filePath, csvContent, "utf8");

    console.log(`CSV file created successfully: ${filePath}`);
}

function getUniqueByProperty<T>(array: T[], property: keyof T): T[] {
    const seen = new Set();
    return array.filter((item) => {
        const key = item[property];
        if (seen.has(key)) {
            return false; // Skip duplicate
        }
        seen.add(key);
        return true; // Include unique item
    });
}

// Example Usage
(async () => {
    const postUrl = "https://www.instagram.com/p/DDSDe5-I6Jg"; // Replace with your post URL
    const comments = await scrapeInstagramComments(postUrl);

    if (comments.length > 0) {
        downloadAsCSV(comments, "instagram_comments.csv");
        console.log(`Scraped ${comments.length} unique comments.`);
    } else {
        console.log("No comments found or failed to scrape.");
    }
})();
