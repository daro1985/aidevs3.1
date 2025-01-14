import { llmCallEmbedding } from "../commons/llmapi";
import { llmCall } from "../commons/llmapi";
import fs from 'fs';
import path from 'path';
import { givenContextSystemPrompt, givenContextUserPrompt } from "./prompts";
import { FaissVectorStore } from "./faissService";

async function createContext(faissService: FaissVectorStore){
   
    const factsDirectory = __dirname+'/file/do-not-share/';
    const files = fs.readdirSync(factsDirectory);

    for(const file of files){
        const data = fs.readFileSync(path.join(factsDirectory, file), 'utf8');
        const chunks = data.split('\n\n');

        for(const chunk of chunks){
            console.log("###Chunk: "+chunk);
           // let context = await llmCall("Text: "+chunk + "\n\n" + "Document: "+data, givenContextSystemPrompt, givenContextUserPrompt);
           // console.log("###Context: "+context);
            const date = file.replace('.txt', '')  // Remove .txt extension
                 .split('_')           // Split on underscores
                 .join('-');           // Join with hyphens

            const document = JSON.stringify({ text: chunk, date: date });
            const embedding = await llmCallEmbedding(document);
         
            faissService.add([embedding as number[]], document);  
            console.log("###Added to FAISS");
        }
    }
}

export { createContext };