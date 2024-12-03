const puppeteer = require('puppeteer');

const infos = require('./infos.json');
const flags = ["A", "B", "C", "D", "E", "F", "G","H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(htmlContent);
  await page.pdf({ path: outputPath, format: 'A4',printBackground: true });
  await browser.close();
}

async function getFirstLineOfItems(arr) {

    let num = 0 , end = 0;

    if(arr.length<4) num = 35, end = 3;
    else num = 22, end = 4;

    let content = `<div style="width: 100%;">
    <div style="width: 100%;display: flex;">`;
    let label = `${arr[0].state}-${arr[0].capital}-${arr[0].city}-${arr[0].currency}-${arr[0].currency_name}`
    content = `${content}<div style="width: 100px;font-size: 12px;">
        <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[0]}</span></div>
        <p>${label}</p>
    </div>`
    for(let i = 1;i<end;i++){
        label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
        content = `${content}<div style="border-top: 1px solid black;width: ${num}%;margin-top: 10px;">&nbsp;</div><div style="width: 100px;font-size: 12px;">
            <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[i]}</span></div>
            <p>${label}</p>
        </div>`
    }
    
    if(arr.length > 4){
        while(arr.length - end > 4) {
            content = `${content}<div style="border-top: 1px solid black;width: 10px;margin-top: 10px;">&nbsp;</div></div></div><div style="width: 100%;">
            <div style="width: 100%;display: flex;">`
            for(let i = end; i < end + 4; i++){
                label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
                content = `${content}<div style="border-top: 1px solid black;width: 22%;margin-top: 10px;">&nbsp;</div><div style="width: 100px;font-size: 12px;">
                    <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[i]}</span></div>
                    <p>${label}</p>
                </div>`
            }
            end += 4;
        }
        if(arr.length > end){
            content = `${content}<div style="border-top: 1px solid black;width: 10px;margin-top: 10px;">&nbsp;</div></div></div><div style="width: 100%;">
            <div style="width: 100%;display: flex;">`;
            for(let i = end; i < arr.length; i++){
                label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
                content = `${content}<div style="border-top: 1px solid black;width: 22%;margin-top: 10px;">&nbsp;</div><div style="width: 100px;font-size: 12px;">
                    <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flags[i]}</span></div>
                    <p>${label}</p>
                </div>`
            }
            content=`${content}</div></div>`;
        } else {
            content=`${content}</div></div>`;
        }    
    } else {
        content=`${content}</div></div>`;
    }

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

const run = async() =>{
    for(let i = 0; i<infos.length; i++){

        let info = infos[i];

        htmlContent = `${htmlContent}
            <div style="width: 95%;padding-left: 2%;margin-top:30px;">
            <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 20px;">
                <span>${info.date}</span>
                <span>Day${i+1}</span>
            </div>
        `
        let tripdata = info.tripData;
    
        let content = await getFirstLineOfItems(tripdata);
    
        htmlContent = `${htmlContent}${content}</div>`;
    
    }
    
    htmlContent = `${htmlContent}</div>`;
    
    // console.log(htmlContent);
    
    generatePDFfromHTML(htmlContent, 'custom.pdf')
      .then(() => console.log('PDF generated successfully'))
      .catch(err => console.error('Error generating PDF:', err));
}

run();