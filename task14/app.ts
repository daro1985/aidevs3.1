import dotenv from 'dotenv';
dotenv.config();

import * as axios from 'axios';
import { llmCall, llmCallv2 } from '../commons/llmapi';
import { extractInfoSystemPrompt, extractInfoUserPrompt } from './prompts';
import * as path from 'path';
import * as fs from 'fs';
import { captureFlag } from '../commons/answer';


const peopleApi = 'https://centrala.ag3nts.org/people';
const placesApi = 'https://centrala.ag3nts.org/places';
const dataUrl = 'https://centrala.ag3nts.org/dane/barbara.txt';

async function getData() {

  const response = await axios.default.get(dataUrl);
 
  const responseFilePath = path.join(__dirname, 'response.txt');
  fs.writeFileSync(responseFilePath, JSON.stringify(response.data, null, 2));
  console.log("###Response written to file: "+responseFilePath);
  return response;
}

async function requestAPI(api: string, query: string) {
  const requestBody = {
    "apikey": process.env.CENTRALA_API_KEY,
    "query": query
  };
  let apiUrl = api=='people' ? peopleApi : placesApi;
  const response = await axios.default.post(apiUrl, requestBody);
 //
 
 //console.log("###"+api+ " response: "+JSON.stringify(response.data, null, 2));
  return response.data;
}




async function main(){

let info: Info = {people: [], places: [], document: ''};

  const responseFilePath = path.join(__dirname, 'response.txt');
   if (!fs.existsSync(responseFilePath)) {
       const data = await getData();
   } else {
       console.log("###Response file already exists.");
   }
  let document =  fs.readFileSync(responseFilePath, 'utf8');
   

   info.document = document;
  
  let inputInfo: any = info;
   
  let newInfo = {people: [], places: []};
   let iteration = 0;
   while (iteration < 1 || (newInfo.people.length > 0  ||  newInfo.places.length > 0)) {
        
        console.log(`Iteration ${iteration}: Processing data...`);
        console.log("###InputInfo before llm: ", JSON.stringify(inputInfo, null, 2));
        const listOfPeople = info.people.map(person => person.name);
        const listOfPlaces = info.places.map(place => place.name);

        const prompt = extractInfoUserPrompt(JSON.stringify(inputInfo));
        const response = await llmCallv2(extractInfoSystemPrompt, prompt) || '';
        
        // Filter out already processed items
        const parsedResponse = JSON.parse(response);
        newInfo.people = parsedResponse.people.filter((person:string) => !listOfPeople.includes(person));
        newInfo.places = parsedResponse.places.filter((place:string) => !listOfPlaces.includes(place));
        
        console.log("###NewInfo after llm: ", JSON.stringify(newInfo, null, 2));
       // console.log("###InputInfo after llm: ", JSON.stringify(inputInfo, null, 2));
        // Process people
        for (const person of newInfo.people) {
            const peopleResult = await requestAPI('people', person);
            //console.log(`Results for person ${person}:`, peopleResult);
            info.people.push({name: person, data: peopleResult});
        }

        // Process places
        for (const place of newInfo.places) {
            const placesResult = await requestAPI('places', place);
            //console.log(`Results for place ${place}:`, placesResult);
            info.places.push({name: place, data: placesResult});
        }

        inputInfo = {people: info.people, places: info.places};
       // console.log("###Info: ", JSON.stringify(info, null, 2));
       console.log("###NewInfo after processing: ", JSON.stringify(newInfo, null, 2));
      // console.log("###InputInfo after processing: ", JSON.stringify(inputInfo, null, 2));
   
        iteration++;
        
   
      }
 
  try{
    const infoJSON = JSON.stringify(info, null, 2);
    fs.writeFileSync(__dirname+'/info.json', infoJSON);
    console.log('Info saved to info.json successfully.');
  } catch (error) {
    console.error('Error saving info to file:', error);
  }


   const city = await llmCall(JSON.stringify(info), 
  `Analize document to answer following questions: W którym mieście znajduje się BARBARA?
  <prompt_rules>
  PEOPLE section contains information about people and places where they have been seen  
  PLACES section contains information about people who have been seen there
  ANSWER ONLY WITH NAME OF THE CITY
  </prompt_rules> 
  `
  , "Document to analize:");

  console.log("###City: ", city);

  captureFlag("loop", city).then(result => {
    console.log("###CaptureFlag result: ", result);
  });
}

main();


interface Info {
  people: {name: string, data: any}[];
  places: {name: string, data: any}[];
  document: string;
}
