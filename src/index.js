import express from 'express';
// import image from './image';
import createRoutes from './routes';
import dataImportES6 from './import/ES6';
import path from 'path';
import bodyParser from 'body-parser';
import loadDatabase, { getDataDb } from './db/connector.js';


const app = express()
  // Lors du lancement du serveur avec npm run local, le port doit être préciser en troisième arguement, ex: npm run local 8853;
  // Si le port n'est pas spécifié, alors le port par defaut sera 8888.
  const port = 5555;
 // const myTypes = dataImportES6.getTypes.amiibo;
  
  app.set('views', path.join(__dirname, 'resources/ejsViews/'));
  app.set('view engine', 'ejs');

const success = () => {
  // demarrer le serveur 
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  app.use('/', createRoutes()); 
  app.use('/', express.static('src/resources/static/jquery-amiibo'));
  app.get('/', (req, res) => res.render('index', { port: port}));
  app.get('/addType', async (req, res) =>{const data = await getDataDb('type'); res.render('addType', {types: data.amiibo})});
  app.get('/addAmiibo', async (req, res) =>{
    const typeData = await  getDataDb('type');
    const characterData = await  getDataDb('characters');
    const gameSerieData = await  getDataDb('gameseries');
    const amiiboSerieData = await  getDataDb('amiiboseries');

    res.render("addAmiibo", {
      types: typeData.amiibo,
      characters: characterData.amiibo,
      gameSeries:gameSerieData.amiibo,
      amiiboSeries: amiiboSerieData.amiibo,
    })
  });
  
 

  app.use('/', (err, req, res, next) => {
    res.status(500).sendFile(__dirname + '/cry.png')
  });

  app.use('/', (req, res, next) => {
    res.status(404).sendFile(__dirname + '/image.png')
  });

  app.listen(port);
  console.log("success !")
};

const error = () => {
  console.log("Error Data !")
};

// dataImportES6.load(success, error);
loadDatabase(success, error);
