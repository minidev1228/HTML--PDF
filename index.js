const puppeteer = require('puppeteer');

const infos = require('./infos.json');
const flags = ["A", "B", "C", "D", "E", "F", "G","H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4',printBackground: true });
  await browser.close();
}

async function getFirstLineOfThreeItems(arr) {

    let num = 0;

    if(arr.length<4) num = 40;
    else num = 25;

    let content = `<div style="width: 100%;">
    <div style="width: 100%;display: flex;">`;
    let label = `${arr[0].state}-${arr[0].capital}-${arr[0].city}-${arr[0].currency}-${arr[0].currency_name}`
    content = `${content}<div style="width: 100px;font-size: 12px;">
        <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[0]}</span></div>
        <p>${label}</p>
    </div>`
    for(let i = 1;i<arr.length;i++){
        label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
        content = `${content}<div style="border-top: 1px solid black;width: ${num}%;margin-top: 10px;">&nbsp;</div><div style="width: 100px;font-size: 12px;">
            <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[i]}</span></div>
            <p>${label}</p>
        </div>`
    }
    content=`${content}</div></div>`;

    return content;
}

var htmlContent = `
<div style="width:100vw;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="width: 95%;display: flex;justify-content:space-between;">
        <h2>VOYA</h2>
        <h4>NOV 4 - NOV 7</h4>
    </div>
    <div style="width: 100%;display: flex;justify-content: center;">
        <h1 style="color: green;">ROME</h1>
    </div>
    <div style="width: 95%; display: flex; justify-content: space-between;padding-left: 2%;margin-bottom: 30px;">
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
`

infos.forEach(async(info, id)=>{
    // console.log(id,"===>",info);
    htmlContent = `${htmlContent}
        <div style="width: 95%;padding-left: 2%;">
        <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 20px;">
            <span>${info.date}</span>
            <span>Day${id+1}</span>
        </div>
    `
    let tripdata = info.tripData;
    let newarr = [];
    for(let i = 0; i<tripdata.length; i++){
        if(i>3) break;
        newarr.push(tripdata[i]);
    }
    let content = await getFirstLineOfThreeItems(newarr);
    console.log(content);
    htmlContent = `${htmlContent}${content}</div>`;
})

htmlContent = `${htmlContent}</div>`;

generatePDFfromHTML(htmlContent, 'custom.pdf')
  .then(() => console.log('PDF generated successfully'))
  .catch(err => console.error('Error generating PDF:', err));