import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { llmCallChat } from '../commons/llmapi';
import { analyzeMessage, analyzePromptData, draftMessage, findMessage, planMessage } from './prompts';
import axios from 'axios';

export async function plan(request: string) {

  const plan = await llmCallChat(planMessage, request as string) as any;      
  const actions = JSON.parse(plan).action;
  console.log("Planning actions:", actions);
  return actions;
}

export async function execute(action: string, message: string) {

  let toolPrompt:ChatCompletionMessageParam[]  = [];
  let toolRequest: string = "";
  let executed: string = "";
  const obj = JSON.parse(message);
  console.log("Action:", action);
  switch(action){
    case "FIND":toolPrompt = findMessage; toolRequest = message; break; 
    case "ANALYZE":toolPrompt = analyzeMessage; toolRequest = analyzePromptData(obj.answer.links); break;
    case "DRAFT":toolPrompt = draftMessage; toolRequest = analyzePromptData(obj.answer.links); break;
    case "CAPTURE": toolRequest = message; break;
  } 
  console.log("ToolPrompt:", toolPrompt);
  console.log("ToolRequest:", toolRequest);
  if(toolPrompt.length > 0){
    const execution = await llmCallChat(toolPrompt, toolRequest) as any; 
    executed = JSON.parse(execution);
  }
  else{
     // const response = await reply(replyTo.API, toolRequest);
      //executed = response;
  }
  console.log("Executed:", executed);
  return executed;
}

export async function answer(actions: string, results: string) {
  let replyTo: string = "";

  switch(actions){
    case "FIND":replyTo = ReplyTo.SELF; break; 
    case "ANALYZE":replyTo = ReplyTo.API; break;
    case "DRAFT":replyTo = ReplyTo.API; break;
    case "CAPTURE": replyTo = ReplyTo.API; break;
  } 
  const response = await reply(replyTo as ReplyTo, results);
  console.log("Answer:", response);
  return response;
}


export async function reply(whom: ReplyTo, message: string){

  let url: string = "", requestBody :any = {};   

  switch(whom){
    case ReplyTo.API:
      url = process.env.CENTRALA_URL as string;
      requestBody = {
        "task": "photos",
        "apikey": process.env.CENTRALA_API_KEY,
        "answer": message
      };
      break;
    case ReplyTo.SELF:
      url = process.env.LOCAL_URL as string;
      requestBody = {
        "answer": message
      };
      break;

  }
  console.log("####RequestBody:",whom," ", requestBody);
  const response = await axios.default.post(url, requestBody); 
  console.log("####Response:", response.data);
  return response.data;

}

export enum ReplyTo {
  API = "API",
  SELF = "SELF"
}
