const puppeteer = require('puppeteer');

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4',printBackground: true });
  await browser.close();
}

// Usage
const htmlContent = `<div style="width:100vw;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
<div style="width: 95%;display: flex;justify-content:space-between;">
    <h2>VOYA</h2>
    <h4>NOV 4 - NOV 7</h4>
</div>
<div style="width: 100%;display: flex;justify-content: center;">
    <h1 style="color: green;">ROME</h1>
</div>
<div style="width: 95%; display: flex; justify-content: space-between;padding-left: 2%;">
    <div style="display: flex;">
        <div style="padding: 3px;border-radius: 50px;background-color: rgba(56, 133, 56, 0.233); margin-right: 8px;">
            <img style="width: 25px;" src="https://img.icons8.com/?size=100&id=107645&format=png&color=008000" alt="">
        </div>
        <label style="font-size: 17px;">Italy</label>
    </div>
    <div style="display: flex;">
        <div style="padding: 3px;border-radius: 50px;background-color: rgba(56, 133, 56, 0.233); margin-right: 8px;">
            <img style="width: 25px;" src="https://img.icons8.com/?size=100&id=NIfROyqzbiHF&format=png&color=008000" alt="">
        </div>
        <label style="font-size: 17px;">35°C</label>
    </div>
    <div style="display: flex;">
        <div style="padding: 3px;border-radius: 50px;background-color: rgba(56, 133, 56, 0.233); margin-right: 8px;">
            <img style="width: 25px;" src="https://img.icons8.com/?size=100&id=47859&format=png&color=008000" alt="">
        </div>
        <label style="font-size: 17px;">1.43€</label>
    </div>
    <div style="display: flex;">
        <div style="padding: 3px;border-radius: 50px;background-color: #3885383b; margin-right: 8px;">
            <img style="width: 25px;" src="https://img.icons8.com/?size=100&id=30244&format=png&color=008000" alt="">
        </div>
        <label style="font-size: 17px;">UTC+1</label>
    </div>
</div>
</div>`;

generatePDFfromHTML(htmlContent, 'custom.pdf')
  .then(() => console.log('PDF generated successfully'))
  .catch(err => console.error('Error generating PDF:', err));