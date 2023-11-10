const express = require('express');
const app = express();
const port = 8080;

//Loads the handlebars module
const handlebars = require('express-handlebars');

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');

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

app.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('main', {layout: 'index'});
});

const fakeApi = () => 'Faker';

app.get('/dynamic', (req, res) => {
  res.render('main', {layout: 'index', proPlayer: fakeApi()});
});

app.listen(port, () => console.log(`App listening to port ${port}`));
