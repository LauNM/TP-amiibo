import https from 'https';

let dataAmiibo = [];
const typeSet = new Set();
const gameSeriesSet = new Set();
const seriesSet = new Set();
const characterSet = new Set();

class ES6DataImport {

    formatJson = (amiiboArray) => {
        let formatedJson = { amiibo: [] };

        amiiboArray.forEach((element) => {
            formatedJson.amiibo.push({ name: element });
        });

        return formatedJson;
    };

    get getDataAmiibo() {
        return { amiibo: dataAmiibo };
    }

    get getTypes() {
        return this.formatJson(typeSet);
    }

    get getCharacter() {
        return this.formatJson(characterSet);
    }

    get getSeries() {
        return this.formatJson(seriesSet);
    }

    get getGameSeries() {
        return this.formatJson(gameSeriesSet);
    }

    getAmiiboByFilter = (amiiboArray, fieldToTest, filterValue) => {
        return { amiibo: amiiboArray.amiibo.filter(amiibo => amiibo[fieldToTest] === filterValue) }
    }


    addType = (type) => {
        typeSet.add(type);
    }

    addAmiibo = (amiibo) => {
        dataAmiibo.push(amiibo)
    }


    request(url, successCallback, errorCallback) {
        https.get(url, (res) => {
            console.log(res.statusCode);

            if (res.statusCode > 399) {
                errorCallback();
                return;
            }

            if (res.statusCode === 308) {
                this.request(res.headers.location, successCallback, errorCallback);
                return;
            }

            res.setEncoding("utf8");

            let str = "";

            res.on("data", (data) => {
                str += data;
            });

            res.on("end", () => {
                const parseData = JSON.parse(str);
                parseData.amiibo.forEach(element => {
                    dataAmiibo.push(element);
                    typeSet.add(element.type);
                    gameSeriesSet.add(element.gameSeries);
                    seriesSet.add(element.amiiboSeries);
                    characterSet.add(element.character)
                });

                //console.log(typeSet);

                successCallback()
            });
        });
    }

    load(successCallback, errorCallback) {
        this.request("https://www.amiiboapi.com/api/amiibo", successCallback, errorCallback);

    }
}

const dataImportES6 = new ES6DataImport();
export default dataImportES6;