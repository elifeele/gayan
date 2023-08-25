const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const config = require('./puppeteer.config')
const checkimei = require('./check-imei')
const simUnlocker = require('./sim-unlock-softbank')
const au = require('./au')
const gsm = require('./gsm')
const gsm2 = require('./gsm2')

const PORT = process.env.PORT || 80 ;
const service = require('./service.config')
const temporary_file_path = './temporary_files'

app.use(express.json({extended: false}));

app.get('/', (req,res) => {
  console.log('Launching puppeteer...');
  puppeteer.launch(config).then(async function(browser){
  
    const page = await browser.newPage();
    console.log('Preforming ststus check...')
    const result = await page.goto(service.Softbank.URL);
  
    console.log('Closing browser...')
    await browser.close();

    if(result.status() == '200'){
      res.send({
        status:'OK',
        body:JSON.stringify(result.headers())
      })
    }
  }).catch(e => {
    console.log(e)
    res.send({
      status:'ERR',
      body: {
        error: e.toString()
      }
    })
  })
})

app.get('/check-imei/softbank/:imei', (req,res) => {
  puppeteer.launch(config).then(async function (browser){

    console.log('Launching puppteer...')
    const page = await browser.newPage();
    await page.goto(service.Softbank.URL);

    await page.$eval('input[name="imei"]', (el, value) => el.value = value, req.params.imei);
    await page.$eval('input[name="ACT_TE001"]', form => form.click());
    

    var image = '';
    setTimeout(async () => {
      image = await page.screenshot({ encoding: "base64" });
      res.send({
        status:'OK',
        body:{
          image: `data:image/png;base64,${image.toString()}`,
        }
      })
      await browser.close();
    },3000)
    console.log('final url',page.url())
  }).catch(err => {
    console.log('ERR',err)
    res.send({
      status:'ERR',
      body:{
        error: err.toString()
      }
    })
  })
})

app.get('/check-imei/au/:imei', (req,res) => {
  puppeteer.launch(config).then(async function (browser){

    console.log('Launching puppteer...')
    const page = await browser.newPage();
    await page.goto(service.au.URL);

    await page.$eval('input[name="IMEI"]', (el, value) => el.value = value, req.params.imei);
    await page.$eval('input[name="次へ"]', form => form.click());
    console.log(`Check for imei [au] -> ${req.params.imei}`)

    var image = '';
    setTimeout(async () => {
      image = await page.screenshot({ encoding: "base64" });
      res.send({
        status:'OK',
        body:{
          image: `data:image/png;base64,${image.toString()}`,
        }
      })
      await browser.close();
    },3000)
    console.log('final url',page.url())
  }).catch(err => {
    console.log('ERR',err)
    res.send({
      status:'ERR',
      body:{
        error: err.toString()
      }
    })
  })
})

app.post('/check-imei/softbank',async (req,res)=>{
  const imei = req.body.imei2;
  console.log('Checking for '  + imei )
  try {
    const result = await checkimei(imei)
    res.status(200)
    .send({
      body: {
        "ok":true,
        "code" : result
      }
    })
  } catch (error) {
    console.log('Err',error)
    res.
    status(500)
    .send({
      body:{
        error : error.toString()
      }
    })
  }
})

app.post('/sim-unlock/softbank',async (req,res)=>{
  const imei = req.body.imei;
  console.log('Checking for '  + imei )
  try {
    const result = await simUnlocker(imei)
    res.status(200)
    .send({
      body: {
        "ok":true,
        "code" : result
      }
    })
  } catch (error) {
    console.log('Err',error)
    res.
    status(500)
    .send({
      body:{
        error : error.toString()
      }
    })
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

app.post('/check-imei/au',async (req,res)=>{
  const imei = req.body.imei3;
  console.log('Checking for '  + imei )
  try {
    const result = await au(imei)
    res.status(200)
    .send({
      body: {
        "ok":true,
        "code" : result
      }
    })
  } catch (error) {
    console.log('Err',error)
    res.
    status(500)
    .send({
      body:{
        error : error.toString()
      }
    })
  }
})

app.post('/check-imei/gsm',async (req,res)=>{
  const imei = req.body.imei4;
  console.log('Checking for '  + imei )

  try {
    const result = await gsm(imei)
   
    res.status(200)
    .send({
      body1: {results1},body2: {results2},body3: {results3},body4: {results4}
      
    })
    


  } catch (error) {
    console.log('Err',error)
    res.
    status(500)
    .send({
      body:{
        error : error.toString()
      }
    })
  }
})
app.post('/check-imei/gsm2',async (req,res)=>{
  const imei = req.body.imei5;
  console.log('Checking for '  + imei )

  try {
    const result = await gsm2(imei)
   
    res.status(200)
    .send({
      body1: {results1}
      
    })
    


  } catch (error) {
    console.log('Err',error)
    res.
    status(500)
    .send({
      body:{
        error : error.toString()
      }
    })
  }
})