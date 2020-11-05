import dataImportES6 from '../import/ES6';
import { getDataDb, addTypeData } from '../db/connector';

const typeControler = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
    // res.status(200).json(getDataDb('type'));
    getDataDb('type').then(result =>{
        res.status(200).json(result);
    })
}



export const addTypeController = async (req, res) => {
    await addTypeData(req.body.value);
    res.status(200).json({ result: true });
  }


// export const addType = (req, res) => {
//     console.log(req.body)
//     dataImportES6.addType(req.body.value);
//     res.status(200).json({result: true});
// }

export default typeControler;