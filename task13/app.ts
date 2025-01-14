import dotenv from 'dotenv';
dotenv.config();

import * as axios from 'axios';
import { llmCall, llmCallv2 } from '../commons/llmapi';
import { answerQuestionsSystemPrompt, answerQuestionsUserPrompt } from './prompts';
import { captureFlag } from '../commons/answer';


const apiUrl = 'https://centrala.ag3nts.org/apidb';



async function requestAPI(query: string) {
  const requestBody = {
    "task": "database",
    "apikey": process.env.CENTRALA_API_KEY,
    "query": query
  };
  const response = await axios.default.post(apiUrl, requestBody);
  console.log("###response: "+JSON.stringify(response.data, null, 2));
  return response.data;
}




async function main(){

    interface DatabaseStructure {
        [key: string]: any;
    }

    const databaseStructure: DatabaseStructure = {};

    const data = await requestAPI("show tables;");
   // console.log("###data: "+JSON.stringify(data, null, 2));
    databaseStructure['tables'] = data.reply;
    let apiResponse = JSON.stringify(data.reply, null, 2)

    for (let item of data.reply) {
 
        const columns = await requestAPI("show create table "+item.Tables_in_banan+";");

        databaseStructure[item.Tables_in_banan] = columns.reply;

        const sample = await requestAPI("select * from "+item.Tables_in_banan+" LIMIT 10;");
      
        databaseStructure[item.Tables_in_banan].push({sample: sample.reply});
    }
    const question = "które aktywne datacenter (DC_ID) są zarządzane przez pracowników, którzy są na urlopie (is_active=0)?";

    const resp = await llmCallv2(answerQuestionsSystemPrompt, answerQuestionsUserPrompt({question, databaseStructure})) || '';

    const sample = await requestAPI(JSON.parse(resp).query);
    console.log("###sample: "+JSON.stringify(sample.reply, null, 2));


    const simpleArray = sample.reply.map((item: any) => parseInt(item.dc_id));

    captureFlag('database', simpleArray).then(flag => {
        console.log("###Flag: "+ JSON.stringify(flag, null, 2));
    })
}

main();


