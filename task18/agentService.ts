import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { llmCallChat } from '../commons/llmapi';
import { planMessage } from './prompts/plan';
import axios from 'axios';
import { findMessage } from '../task16.2/prompts';
import { lookupMessage, verificationMessage } from './prompts/act/lookup';
import { saveFile } from './commonTools';
import { captureFlag } from '../commons/answer';

export async function plan(request: string) {

  const response = await llmCallChat(planMessage(), request as string, 'json_object') as any;      
  const theplan = JSON.parse(response);
  //console.log("Planning :", theplan);
  return theplan;
}

export async function act(theplan: any) {

  try{
    let executed: any[] = [];
    let iteration = 0;
    let item = 0;
    let answers: any[] = [];
    let finalJSON: string = "";
    console.log("Action:", theplan.plan);
    for(const step of theplan.plan){
      item++;
      step.subplan.push(JSON.parse(JSON.stringify(step)));

      for(const substep of step.subplan){
          iteration++;
          if(iteration > 15){
            saveItems(executed, step, item);
            return "Limit exceeded";
          } 
          const history = step.subplan.map((x: any) => x.resources).flat();
          console.log("$$$$History:", history);
          const prompt = await lookupMessage(substep.resources, history);
      
          const result = await llmCallChat(prompt, substep.query, 'json_object') as any; 
          const resultJSON = JSON.parse(result);
          switch(resultJSON.next_step){
            case "lookup": step.subplan.push({tool: "LOOKUP", query: substep.query, resources: resultJSON.resources}); break;
            case "done": 
            {
              //const verification = await llmCallChat(await verificationMessage(resultJSON.resources, substep.query) , JSON.stringify(resultJSON.answer), 'json_object') as any; 
              //const verificationJSON = JSON.parse(verification);
              //answers.push('0'+item+':'+verificationJSON.suggested_answer); 
              answers.push(`"0${item}":"${resultJSON.answer}"`);
              
              finalJSON = `{${answers.join(',')}}`;
             // answers.push("02:https://banan.ag3nts.org");
             // answers.push("03:ISO 9001 and ISO/IEC 27001");

              break;
            }
          }
          executed.push({ query: substep.query, execution: result});
        
        console.log("ThePlan items:", step.subplan.length);
      } 
      saveItems(executed, step, item);
      
    }
    console.log("Answers:", finalJSON);
    const flag = await captureFlag("softo", JSON.parse(finalJSON));
    console.log("Result:", flag);
  
    return executed;

    }
    catch(error){
      console.log("ACTError:", error);
      return error;
    }

}  

export async function answer(actions: string, results: string) {
  let replyTo: string = "";

  switch(actions){
    case "FIND":replyTo = ReplyTo.SELF; break; 
    case "ANALYZE":replyTo = ReplyTo.API; break;
    case "DRAFT":replyTo = ReplyTo.API; break;
    case "CAPTURE": replyTo = ReplyTo.API; break;
  } 
  const response = "not used";//await reply(replyTo as ReplyTo, results);
  console.log("Answer:", response);
  return response;


  // console.log("####RequestBody:",whom," ", requestBody);
  // const response = await axios.default.post(url, requestBody); 
  // console.log("####Response:", response.data);
  // return response.data;

}

export enum ReplyTo {
  API = "API",
  SELF = "SELF"
}


function saveItems(executed: any, theplan: any, item: number) {
  
  saveFile(`/result-${item}.json`, JSON.stringify(executed, null, 2));
  saveFile(`/theplan-${item}.json`, JSON.stringify(theplan, null, 2));
  const parseExecution = (x: any) => 
    typeof x.execution === 'string' ? JSON.parse(x.execution) : x.execution;
  saveFile(`/answers-${item}.json`, JSON.stringify(
    executed
      .filter((x: any) => parseExecution(x).answer?.trim())
      .map((x: any) => parseExecution(x).answer), 
    null, 
    2
  ));
  
}