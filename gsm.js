const puppeteer = require('puppeteer');
const config = require('./puppeteer.config')

module.exports = async (imei4) => {
    console.log("Launching puppeteer...")
    
    const browser = await puppeteer.launch(config)
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    var imei_num = imei4;

    await page.goto(imei_num)

    await page.setViewport({ width: 1280, height: 577 })

  
    
    log('INFO','Navigate imei chack page succeed!')

  

    // copy the code and send it back to the index
    
    var unlockCode = '';
    try {
        await page.waitForSelector('.article-info > .center-stage > .specs-photo-main > a > img');

  // Get the image element
  const imgElement = await page.$('.article-info > .center-stage > .specs-photo-main > a > img');
  const codeSelector1 = ('.main > .review-header > .article-info > .article-info-line > .specs-phone-name-title')
  const codeSelector2 = ('.review-header > .article-info > .center-stage > .specs-spotlight-features > .specs-brief')
  const codeSelector3 = ('#specs-list')
  
  const text = await page.evaluate(el => el.innerText, (await page.$$(codeSelector1))[0])
  const text1 = await page.evaluate(el => el.innerText, (await page.$$(codeSelector2))[0])
  const text2 = await page.evaluate(el => el.innerText, (await page.$$(codeSelector3))[0])

  console.log(codeSelector1);('Unlock code is   ' + text1)
  console.log(codeSelector2);('Unlock code is   ' + text)
  console.log(codeSelector3);('Unlock code is   ' + text2)

  // Get the 'src' attribute of the image element
  const downloadLink = await imgElement.evaluate(img => img.getAttribute('src'));
  console.log('Download link:', downloadLink);
  
  
  await browser.close()
results1 = text1;
results2 = text;
results4 = text2;
results3 = downloadLink;
return ( results1,results2,results3,results4);

    }catch(err){
        log('ERR', err)
        throw new Error('ERR', err)
    }

    


    
}



const log = (type, message) => {
    console.log(`${type} : ${message}`)
}

const terminate = async (browser, error) => {
    await browser.close();
    log('ERR', error)
    throw new Error('ERR', error)
}