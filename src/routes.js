import { Router } from "express";
import amiiboControler, {addAmiibo} from "./controllers/amiibo";
import typeControler, {addTypeController} from "./controllers/type";
import seriesControler from "./controllers/series";
import gameSeriesControler from "./controllers/gameSeries";
import characterControler from "./controllers/character";

const createRoutes = () => {
  const routes = Router();

  routes.post('/api/amiibo', addAmiibo)
  routes.post('/api/type', addTypeController)
  
  routes.get('/api/amiibo', amiiboControler);
  routes.get('/api/type', typeControler);
  routes.get('/api/amiiboseries', seriesControler);
  routes.get('/api/gameseries', gameSeriesControler);
  routes.get('/api/character', characterControler);

  return routes;
};

export default createRoutes;