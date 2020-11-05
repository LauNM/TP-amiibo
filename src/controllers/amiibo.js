import dataImportES6 from '../import/ES6';
import { connector } from '../db/connector';





const amiiboControler = (req, res) => {
    //const urlParameters = req.query;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //let amiiboFilteredArray = dataImportES6.getDataAmiibo;
    connector.query('USE amiibo; SELECT amiibo.name, amiibo.image, type.name AS typeName, gameseries.name AS gameName, amiiboseries.name AS serieName, characters.name AS characterName FROM amiibo INNER JOIN type ON amiibo.type_id=type.id INNER JOIN characters ON amiibo.character_id=characters.id INNER JOIN amiiboseries ON amiibo.amiiboserie_id=amiiboseries.id INNER JOIN gameseries ON amiibo.gameserie_id=gameseries.id;', (err, result) => {
        //console.log(result[1]);
        let amiiboFilteredArray = { amiibo: [] };
        if (err) throw err;

        result[1].forEach(item => {
            amiiboFilteredArray.amiibo.push({ 
                name: item.name,
                character: item.characterName,
                type: item.typeName,
                image: item.image,
                amiiboSeries:item.serieName,
                gameSeries: item.gameName });
        });
        

        for (const property in req.query) {
            amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, property, req.query[property]);
        }
    
        res.status(200).json(amiiboFilteredArray);
    })



    /* if (urlParameters.type) 
        amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, "type", urlParameters.type)
    if (urlParameters.amiiboSeries) 
        amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, "amiiboSeries", urlParameters.amiiboSeries);
    if (urlParameters.gameSeries) 
        amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, "gameSeries", urlParameters.gameSeries);
    if (urlParameters.character) 
        amiiboFilteredArray = dataImportES6.getAmiiboByFilter(amiiboFilteredArray, "character", urlParameters.character); */

    

}

export const addAmiibo = (req, res) => {

    const amiibo = {
        "amiiboSeries": req.body.serie,
        "character": req.body.character,
        "gameSeries": req.body.gameSerie,
        "image": req.body.image,
        "name": req.body.name,
        "type": req.body.type
    }

    dataImportES6.addAmiibo(amiibo);
    res.status(200).json({ result: true });
    console.log(amiibo)
}
//getAmiiboFilter => à placer quelque part
export default amiiboControler;