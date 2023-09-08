const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Capture network requests
    await page.setRequestInterception(true);

    page.on('request', (request) => {
        request.continue();
    });

    const responses = [];
    page.on('response', (response) => {
        responses.push(response);
    });

    // Navigate to the website
    await page.goto('https://puzzlemadness.co.uk/nurikabe/small/2016/07/16');

    // Wait for a moment to allow potential AJAX requests to complete
    await page.waitForTimeout(5000);

    // Analyze responses to find the puzzle data
    const puzzleDataResponse = responses.find((response) => {
        return response.url().includes('/user/nextpuzzle/');
    });

    if (puzzleDataResponse) {
        const puzzleData = await puzzleDataResponse.json();
        console.log('Puzzle data:', puzzleData);
    } else {
        console.log('Puzzle data not found in network responses.');
    }

    await browser.close();
})();
