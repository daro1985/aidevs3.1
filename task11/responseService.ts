import * as fs from 'fs';
import * as path from 'path';
import { llmCall, llmCallEmbedding }  from '../commons/llmapi';  
import { FaissVectorStore } from './faissService';
import { generateKeywordsSystemPrompt, generateKeywordsUserPrompt, generateSummarySystemPrompt, generateSummaryUserPrompt   } from './prompts'    

let response: { [key: string]: string } = {};

export async function createResponse(faissService: FaissVectorStore): Promise<{ [key: string]: string }> {

    const filesDirectory = __dirname+'/files';
    const txtFiles = fs.readdirSync(filesDirectory).filter(file => path.extname(file) === '.txt');

    for(const file of txtFiles){
        console.log("###File: "+file);
        const filePath = path.join(filesDirectory, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log("###File content: "+fileContent);
        const embedding = await llmCallEmbedding(fileContent);
        const result = await faissService.search(embedding as number[], 5);
        console.log("###result: "+JSON.stringify(result, null, 2));
        let context: string[] = []

        result.labels.forEach((label: number) => {
            context.push(faissService.getMetadata(label) as string);
        });
        console.log("###context: "+JSON.stringify(context, null, 2));
        const summary = await llmCall("Document: "+fileContent+"\n\nContext: "+JSON.stringify(context),  generateSummarySystemPrompt, generateSummaryUserPrompt) || '';
        console.log("###summary: "+JSON.stringify(summary, null, 2));
        const responseItems = await llmCall("Filename: " + file +"\n\nSummary: "+JSON.stringify(summary), generateKeywordsSystemPrompt, generateKeywordsUserPrompt) || '';

        console.log("###file: "+file);
        console.log("###response: "+responseItems);
        response[file] = responseItems;
    }

    return response;

}

