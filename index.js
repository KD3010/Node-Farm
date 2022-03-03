const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

// Reading and Writing in file system using Node.js Synchronously
/*
const txtIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(txtIn);

const txtOut = `This is what we know about Avacado: ${txtIn}.\n Created on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', txtOut);
console.log('File has been written!');

// Reading and Writing in file system using Node.js Asynchronously
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
 fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
  console.log(data2);
  fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
   console.log(data3);

   fs.writeFile('.txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
    console.log('Your data has been written');
   });
  });
 });
});
console.log(`Will read file!`);
*/
// ////////////////////////////////////////////////////////////////////////////////////////

// SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url);

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHTML);
    //   console.log(cardHTML);

    res.end(output);
  }
  // PRODUCT PAGE
  else if (pathname === '/product') {
    const product = dataObj[query.slice(3, 4)];
    res.writeHead(200, { 'Content-type': 'text/html' });

    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  // PAGE NOT FOUND
  else {
    res.writeHead(404, {});
    res.end('Page not found!');
  }
  // res.end('Hello from the server!');
});

server.listen(3000, () => {
  console.log('Server has started! on port 3000');
});
