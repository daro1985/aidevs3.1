import dotenv from 'dotenv';
dotenv.config();

import * as axios from 'axios';
import { llmCall, llmCallImage, llmCallv2 } from '../commons/llmapi';
import { captureFlag } from '../commons/answer';
import { describePersonPrompt, imageCorrectionPrompt, imageCorrectionPromptUser, imageLocationPrompt } from './prompts';






async function requestAPI(query: string) {
  const requestBody = {
    "task": "photos",
    "apikey": process.env.CENTRALA_API_KEY,
    "answer": query
  };
  const response = await axios.default.post(process.env.CENTRALA_URL as string, requestBody);
  //console.log("###response: "+JSON.stringify(response.data, null, 2));
  return response.data;
}

function extractUrls(text: any): string[] {
    if (typeof text !== 'string') {
        text = JSON.stringify(text);
    }
    
    // Extract base URL
    const urlPattern = /(https?:\/\/[^\s]+\/)/g;
    const baseUrl = text.match(urlPattern)?.[0] || '';
    
    // Extract filenames
    const filenamePattern = /IMG_\d+\.PNG/g;
    const filenames = text.match(filenamePattern) || [];
    
    // Combine base URL with filenames
    return filenames.map((filename: string) => baseUrl + filename);
}

async function main(){
    try {
        let result = await requestAPI('START');
        // let urls = extractUrls(result);
        // console.log("###urls:", urls);

        let result2 = await llmCallv2(imageLocationPrompt(), result.message) as any; 
        console.log("###result2:", result2);
        
        let urls: string[] = JSON.parse(result2)
        
      let newURLs: string[] = []
      
      for (let url of urls){
        let filename = url.split('/').pop() || '';
        console.log("###filename:", filename);
        let result3 = await llmCallImage(imageCorrectionPrompt(filename),imageCorrectionPromptUser([url])) as any;
 
        let action: string = result3
        console.log("###action for url:", url, ">>>", action);

        if (!action.startsWith('SKIP')){
          let result4 = await requestAPI(action);
          console.log("###comment for url:", url, ">>>", result4); 
          newURLs.push(result4.message)
        }else{
          newURLs.push("Tego nie zmieniam, łap: "+url)
        }
     
      }

      console.log("###newURLs:", newURLs);

      let result5 = await llmCallv2(imageLocationPrompt(), newURLs.join('\n')) as any; 
      console.log("###result5:", result5);

      let correctedURLs: string[] = JSON.parse(result5)

      let description = await llmCallImage(describePersonPrompt(), imageCorrectionPromptUser(correctedURLs)) as any;
      console.log("###description:", description);

      let flag = await captureFlag("photos", description)    
      console.log("###flag:", flag);


    } catch (error) {
        console.error("Error in main:", error);
    }
}

main();


