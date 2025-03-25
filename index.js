const puppeteer = require('puppeteer');
const express = require('express');

const app = express();

// Root route
app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

// Scraping route
app.get('/scrape', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        
        await page.goto('https://maps.google.com/?cid=6140691952107703956', { waitUntil: 'networkidle2' });

        // Wait for the button to appear
        await page.waitForSelector("button.DkEaL", { timeout: 10000 });

        // Extract category
        const category = await page.evaluate(() => {
            let categoryElement = document.querySelector("button.DkEaL");
            return categoryElement ? categoryElement.innerText : "Category not found!";
        });

        await browser.close();

        res.json({ category }); // Send response as JSON

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Scraping failed" });
    }
});

// Start Express server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
