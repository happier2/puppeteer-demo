const puppeteer = require('puppeteer');
var { timeout } = require('../tools/tools.js');

const pdfOptions = { format: 'A4' }


puppeteer.launch().then(async browser => {
  let page = await browser.newPage();

  await page.goto('http://es6.ruanyifeng.com/#README', { waitUntil: 'networkidle2' });
  // await timeout(2000);

  let aTags = await page.evaluate(() => {
    let as = [...document.querySelectorAll('ol li a')];
    return as.map((a) => {
      return {
        href: a.href.trim(),
        name: a.text
      }
    });
  });
  await page.emulateMedia('screen')
  await page.pdf({ ...pdfOptions, path: `./data/es6-pdf/${aTags[0].name}.pdf` });
  await page.close()

  // 这里也可以使用promise all，但cpu可能吃紧，谨慎操作
  for (let i = 1; i < aTags.length; i++) {
    console.log(`Starting get ${i} page`)
    page = await browser.newPage()

    var a = aTags[i];

    await page.goto(a.href, { waitUntil: 'networkidle2' });

    // await timeout(2000);

    await page.emulateMedia('screen')

    await page.pdf({ ...pdfOptions, path: `./data/es6-pdf/${a.name}.pdf` });

    await page.close();
  }

  await browser.close();
}).catch(error => console.log(error));
