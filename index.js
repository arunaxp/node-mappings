const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAcc = require('./ferrous-store-service-account.json');
const express = require('express');
const app = express();

//Loads the handlebars module
const handlebars = require('express-handlebars');

// var serviceAcc = {
//   "type": process.env.type,
//   "project_id": process.env.project_id,
//   "private_key_id": process.env.private_key_id,
//   "private_key": process.env.private_key,
//   "client_email": process.env.client_email,
//   "client_id": process.env.client_id,
//   "auth_uri":  process.env.auth_uri,
//   "token_uri":  process.env.token_uri,
//   "auth_provider_x509_cert_url":  process.env.auth_provider_x509_cert_url,
//   "client_x509_cert_url":  process.env.client_x509_cert_url,
//   "universe_domain": process.env.universe_domain,
// }

initializeApp({
  credential: cert(JSON.parse(process.env.serviceAcc)),
  databaseURL: process.env.databaseURL,
});
//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');

// var hbs = handlebars.create({});
// hbs.handlebars.registerHelper("increasePrice", function (price) {
//   price += 10;
//   return price;
// });
//Sets handlebars configurations (we will go through them later on)
app.engine(
  'hbs',
  handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'planB',
    partialsDir: __dirname + '/views/partials/',
  })
);

app.use('/public', express.static('public'));

const alldata = async () => {
  const db = getFirestore();
  var d = [];
  const snapshot = await db.collection('SampleDocs').get();
  snapshot.forEach((doc) => {
    //console.log(doc.data()?.Name);
    d.push({ name: doc.data()?.Name });
  });
  console.log(d);
  return d;
};

app.get('/', async (req, res) => {
  res.render('main', { layout: 'index', data: await alldata() });
});

const fakeApi = () => 'Faker';

app.get('/dynamic2', (req, res) => {
  res.render('main', { layout: 'index', proPlayer: fakeApi() });
});

// app.get('/testDB', async (req, res) => {
//   const db = getFirestore();

//   const snapshot = await db.collection('SampleDocs').get();

//   // Print the ID and contents of each document
//   var d = '';
//   snapshot.forEach((doc) => {
//     console.log(doc.id, ' => ', doc.data());
//     d += doc.data()?.Name;
//   });
//   res.send({ Message: d });
// });

// Handlebars.registerHelper('SampleDocs', async function () {
//   const db = getFirestore();
//   var d = ['A', 'B'];
//   const snapshot = await db.collection('SampleDocs').get();
//   snapshot.forEach((doc) => {
//     console.log(doc.data()?.Name);
//     d.push(doc.data()?.Name);
//   });
//   console.log(d);
//   return d; //just return global variable value
// });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Hello from Cloud Run! The container started successfully and is listening for HTTP requests on ${PORT}`
  );
});
