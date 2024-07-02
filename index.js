const puppeteer = require('puppeteer');

async function performSearch(number, keysData) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();


    await page.goto(
        'https://portaleservices.scfhs.org.sa/Pages/RegistrationValidity.aspx?lang=ar')


    await page.waitForSelector('*');

    // Perform actions
    await page.select('#DDLSearchType', 'RegistrationNumber');

    // Use the provided number to fill in the input field
    await page.type('input[name="txt_RegisterNo"]', number);

    const confirmText = await page.$eval('input[name="result"]', (input) => input.value);
    await page.type('input[name="txt_RandomNumber"]', confirmText);

    await page.click('input[name="btn_Search"]');
    try{

        await page.waitForSelector('th');
        await page.waitForSelector('td');

        // Create a dictionary with keys and values

        const dataDict = await page.evaluate(() => {
            const tableKeys = Array.from(document.querySelectorAll('th'));
            const tableValues = Array.from(document.querySelectorAll('td'));

            const dict = {};
            const keysData = ['SCHSRegistrationNo', 'arName', 'enName', 'regStatus', 'regValidity', 'classification', 'type', 'sprecializtion', 'expirationDate'];

            tableKeys.forEach((key, index) => {
                dict[keysData[index]] = tableValues[index].textContent.trim();
            });

            return dict;
        });

        // Export the dictionary as JSON
        const fs = require('fs');
        fs.writeFileSync('output.json', JSON.stringify(dataDict, null, 2));

        await browser.close();
    }
    catch(error){
        console.log(error )
        await browser.close();

    }
    // Wait for the table to load
}

// Example usage
const registrationNumber = '19089486';
performSearch(registrationNumber);
