 import { FaissVectorStore } from './faissService';
 import { createContext } from './contextService';
// import { createResponse } from './responseService';
const dataUrl = `https://centrala.ag3nts.org/dane/pliki_z_fabryki.zip`;
const filePath =  __dirname+'/files/'+`weapons_tests.zip`;
import * as fs from 'fs';
import * as path from 'path';
import * as axios from 'axios';
import * as unzipper from 'unzipper';
import { captureFlag } from '../commons/answer';
import { createResponse } from './responseService';



async function downloadAndUnzip() {
    const response = await axios.default.get(dataUrl, { responseType: 'arraybuffer' });
    const zipFilePath = path.join(__dirname, 'data.zip');
    fs.writeFileSync(zipFilePath, response.data);
    await fs.createReadStream(zipFilePath).pipe(unzipper.Extract({ path: __dirname+'/files' })).promise();
    fs.unlinkSync(zipFilePath);

    const directory = await unzipper.Open.file(filePath);
    await directory.extract({
        path: __dirname+'/file',
        password: '1670'
    } as unzipper.ParseOptions);
    fs.unlinkSync(filePath);
}




async function main(){

    await downloadAndUnzip()

    const faissService = new FaissVectorStore(1536, __dirname+'/vector');// Changed to 3072 for text-embedding-3-large and 1536 for text-embedding-3-small

    //llmCall(data, systemPrompt, userPrompt)
    await faissService.load();
    if(faissService.getIndexTotal() == 0){
        await createContext(faissService);
    }
    else{
        console.log("###Context already created with "+faissService.getIndexTotal()+" vectors");
    }

    // const query = "Kim jest Azazel?";
    // const embedding = await llmCallEmbedding(query);
    // const result = await faissService.search(embedding as number[], 3);
    // console.log("###Result:", JSON.stringify(result.labels, null, 2));

    // result.labels.forEach((label: number) => {
    //     console.log("###Result:", JSON.stringify(faissService.getMetadata(label), null, 2));
    // });
    const resp = await createResponse(faissService);
    const responseString = resp // JSON.stringify(resp, null, 2);
    console.log("###Response: "+ responseString);
    const responseFilePath = path.join(__dirname, 'response.json');
    fs.writeFileSync(responseFilePath, JSON.stringify(resp, null, 2));
    console.log("###Response written to file: "+responseFilePath);
    const flag = await captureFlag('wektory', resp);
    console.log("###Flag: "+ JSON.stringify(flag, null, 2));
}

main();



// captureFlag('dokumenty', {
//     'dokumenty': 'dokumenty'
// }).then(flag => {
//     console.log("###Flag: "+flag);
// })
// })