const puppeteer = require('puppeteer');
const path = require('path');

const infos = require('./infos.json');
const flags = ["A", "B", "C", "D", "E", "F", "G","H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

async function generatePDFfromHTML(htmlContent, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outputPath, format: 'A4',printBackground: true, margin:{top:"10px"}});
  await browser.close();
}

function getFirstPoint(flag, title) {
    let content = `<div style="width: 100px;font-size: 12px;position: relative;">
        <div style="width: 100%;position: absolute;margin-top: 10px;display: flex;">
            <div style="width: 50%;">&nbsp;</div>
            <div style="border-top: 1px solid black;width: 50%;">&nbsp;</div>
        </div>
        <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flag}</span></div>
        <p style="text-align: center;">${title}</p>
    </div>`

    return content;
}

function getLastPoint(flag, title) {
    let content = `<div style="width: 100px;font-size: 12px;position: relative;">
        <div style="width: 100%;position: absolute;margin-top: 10px;display: flex;">
            <div style="border-top: 1px solid black;width: 50%;">&nbsp;</div>
            <div style="width: 50%;">&nbsp;</div>
        </div>
        <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flag}</span></div>
        <p style="text-align: center;">${title}</p>
    </div>`

    return content;
}

function getMidPoint(flag, title) {
    let content = `<div style="width: 100px;font-size: 12px; position: relative;">
        <div style="width: 100%;position: absolute;margin-top: 10px;display: flex;">
            <div style="border-top: 1px solid black;width: 50%;">&nbsp;</div>
            <div style="border-top: 1px solid black;width: 50%;">&nbsp;</div>
        </div>
        <div style="margin-left: 23px; height: 30px;width: 30px;background-color: black;color: white;display: flex;justify-content: center;align-items: center;border-radius: 50px;"><span>${flag}</span></div>
        <p style="text-align: center;">${title}</p>
    </div>`

    return content;
}

async function getFirstLineOfItems(arr) {

    let num = 0 , end = 0;

    if(arr.length<4) num = 35, end = 3;
    else num = 22, end = 4;

    let content = `<div style="width: 100%;page-break-inside: avoid;">
    <div style="width: 100%;display: flex;">`;
    let label = `${arr[0].state}-${arr[0].capital}-${arr[0].city}-${arr[0].currency}-${arr[0].currency_name}`
    content = `${content}${getFirstPoint("A", label)}`;
    
    if(arr.length > 4){
        for(let i = 1;i<end;i++){
            label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
            content = `${content}<div style="border-top: 1px solid black;width: ${num}%;margin-top: 10px;">&nbsp;</div>${getMidPoint(flags[i], label)}`
        }
        while(arr.length - end > 4) {
            content = `${content}<div style="border-top: 1px solid black;width: 10px;margin-top: 10px;">&nbsp;</div></div></div><div style="width: 100%;page-break-inside: avoid;">
            <div style="width: 100%;display: flex;">`
            for(let i = end; i < end + 4; i++){
                label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
                content = `${content}<div style="border-top: 1px solid black;width: 15%;margin-top: 10px;">&nbsp;</div>${getMidPoint(flags[i], label)}`
            }
            end += 4;
        }
        if(arr.length > end){
            content = `${content}<div style="border-top: 1px solid black;width: 10px;margin-top: 10px;">&nbsp;</div></div></div><div style="width: 100%;page-break-inside: avoid;">
            <div style="width: 100%;display: flex;">`;
            for(let i = end; i < arr.length - 1; i++){
                label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
                content = `${content}<div style="border-top: 1px solid black;width: 15%;margin-top: 10px;">&nbsp;</div>${getMidPoint(flags[i], label)}`
            }
            let j = arr.length - 1;
            label = `${arr[j].state}-${arr[j].capital}-${arr[j].city}-${arr[j].currency}-${arr[j].currency_name}`
            content = `${content}<div style="border-top: 1px solid black;width: 15%;margin-top: 10px;">&nbsp;</div>${getLastPoint(flags[j], label)}`
            content=`${content}</div></div>`;
        } else {
            content=`${content}</div></div>`;
        }    
    } else {
        for(let i = 1;i<end-1;i++){
            label = `${arr[i].state}-${arr[i].capital}-${arr[i].city}-${arr[i].currency}-${arr[i].currency_name}`
            content = `${content}<div style="border-top: 1px solid black;width: ${num}%;margin-top: 10px;">&nbsp;</div>
            ${getMidPoint(flags[i], label)}`;
        }
        label = `${arr[end-1].state}-${arr[end-1].capital}-${arr[end-1].city}-${arr[end-1].currency}-${arr[end-1].currency_name}`
        content = `${content}<div style="border-top: 1px solid black;width: ${num}%;margin-top: 10px;">&nbsp;</div>
        ${getLastPoint(flags[end-1], label )}`
        content = `${content}</div></div>`;
    }

    return content;
}

// const imagePath = path.resolve(__dirname, '1.jpeg');
const imagePath = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFF4clu9r32mTCG6OM9RVX-FuLDBY7gIXK00LgMq1uOsyT7t0u8mkUNbSj0yGCSkssvDk&usqp=CAU";

var htmlContent = `
<body style="margin:0px;">
<div style="width:100vw;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;position:relative;">
    <img src="${imagePath}" style="position: fixed;bottom: 0px;width: 100%;height: 50px;" alt="">
    <div style="margin:20px;">
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
            <div style="width: 100%;display: flex;justify-content: space-between;margin-bottom: 20px;page-break-inside: avoid;">
                <span>${info.date}</span>
                <span>Day${i+1}</span>
            </div>
        `
        let tripdata = info.tripData;
    
        let content = await getFirstLineOfItems(tripdata);
    
        htmlContent = `${htmlContent}${content}</div>`;
    
    }
    
    htmlContent = `${htmlContent}</div></div></body>`;
    
    // console.log(htmlContent);
    
    generatePDFfromHTML(htmlContent, 'custom.pdf')
      .then(() => console.log('PDF generated successfully'))
      .catch(err => console.error('Error generating PDF:', err));
}

run();