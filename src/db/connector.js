import dataImportES6 from '../import/ES6'
import mysql from 'mysql';
import Importer from 'mysql-import';

const host = 'localhost';
const user = 'root';
const password = '';
const databaseName = 'amiibo';

export const datas = (tableName, data) => {
    /*  for (let i = 0 ; i < data.length ; i++) {
        connector.query(`INSERT INTO ${tableName} (id, name) VALUES (${i}+1, "${data[i].name}");`);
    }  */ 
    let map = new Map();
    data.forEach((element , index) => {
        const sql = `INSERT INTO ${tableName} (id, name) VALUES (${index+1}, "${element.name}");`;
        map.set(element.name, index+1)
        
        connector.query(sql);
    });
   // console.log(map);
    return map; 
}
export const addTypeData = (typeToAdd) => {
    return new Promise((resolve, reject) =>{
        connector.query(
            `INSERT INTO type (name) VALUES ("${typeToAdd}");`, (err, results) => {
                if(err) reject(err);
                resolve()
                   
                  }
        )
    })
}

export const getDataDb = (tableName) => {
    return new Promise((resolve, reject) =>{
        let jsonData = { amiibo: [] };
    connector.query(
      `SELECT * FROM ${tableName};`, (err, result) => {
          
        if(err) {
          console.log("-----> ERROR MAKING JSON <-----");
          reject(err);
        }
        result.forEach(item => {
          jsonData.amiibo.push({ name: item.name });
         
        }); 
        //console.log(jsonData);
        resolve(jsonData);
      });
    })
}

const bigDataAmiibo = (tableName, data, mapType, mapSerie, mapGameSerie,  mapCharacter) => {
    data.forEach((element , index) => {
        const sql = `INSERT INTO ${tableName} (id, name, image, type_id, character_id, gameserie_id, amiiboserie_id) VALUES (${index+1}, "${element.name}", "${element.image}", '${mapType.get(element.type)}', '${mapCharacter.get(element.character)}', '${mapGameSerie.get(element.gameSeries)}', '${mapSerie.get(element.amiiboSeries)}' );`;
        connector.query(sql);
    });
}

export const connector = mysql.createConnection({ host, user, password, multipleStatements: true });

const importES6Data = (successCallback, errorCallback) => {
    console.log("Ready to import ES6 data");
    dataImportES6.load(
        () => {
          const mapType = datas('type',  dataImportES6.getTypes.amiibo);
          const mapSerie =  datas('amiiboseries',  dataImportES6.getSeries.amiibo);
          const mapGameSerie =  datas('gameseries',  dataImportES6.getGameSeries.amiibo);
          const mapCharacter =  datas('characters',  dataImportES6.getCharacter.amiibo);
            //console.log("DATA ES6 IMPORTED")
            bigDataAmiibo('amiibo', dataImportES6.getDataAmiibo.amiibo, mapType, mapSerie,  mapGameSerie, mapCharacter );
            successCallback(); 
        },
        errorCallback // = à (err) => { errorCallback(err);}
    );
}

const createDatabase = (successCallback, errorCallback) => {
    console.log('Ready to create database');
    const importer = new Importer({ host, user, password, databaseName });
    importer.import('./src/db/test.sql').then(()=>{
        console.log('DATABASE CREATED');
        connector.query(
            "USE amiibo",
            (err, results) => {
                if (err) {
                    errorCallback(err);
                    return;
                } 
            importES6Data(successCallback, errorCallback);
            }
            
            
        );
        /* let files_imported = importer.getImported();
        console.log(`${files_imported.length} SQL file(s) imported.`); */
    
      }).catch(
          err => {
        errorCallback(err);
      });
    

}

const loadDatabase = (successCallback, errorCallback) => {
    connector.connect((err) => {
        if (err) { 
            errorCallback;
            return;
        }
        connector.query(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`,
            (err, results) => {
                if (err) errorCallback(err);
                if (results.length > 0) {
                    
                    console.log('data base already exist, USE IT!');
                    connector.query(
                        "USE amiibo",
                        (err, results) => {
                        successCallback();
                        }
                    ) 
                } else {
                    createDatabase(successCallback, errorCallback);
                    
                } 
               
            }
        );
    })
};


export default loadDatabase;
