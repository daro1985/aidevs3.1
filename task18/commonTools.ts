import axios from "axios";
import * as path from 'path';
import * as fs from 'fs';

import dotenv from 'dotenv';

dotenv.config();

const questionsUrl = `https://centrala.ag3nts.org/data/${process.env.CENTRALA_API_KEY}/softo.json`;

const webUrl = 'https://softo.ag3nts.org/';

export async function getData() {

    const response = await axios.default.get(questionsUrl);
   
    const responseFilePath = path.join(__dirname, 'questions.json');
    fs.writeFileSync(responseFilePath, JSON.stringify(response.data, null, 2));
    console.log("###Response written to file: "+responseFilePath);
    return response.data;
  }


  export async function readFile(filepath: string) {
    try {
      const fileContent = await fs.promises.readFile(filepath, 'utf8');
      console.log(`File content read successfully: ${filepath}`);
      return fileContent;
    } catch (error) {
      console.error(`Error reading file: ${error}`);
      throw error;
    }
  }

  export async function saveFile(filepath: string, content: string) {
    try {
      await fs.promises.writeFile(__dirname + filepath, content, 'utf8');
      console.log(`File content saved successfully: ${filepath}`);
    } catch (error) {
      console.error(`Error saving file: ${error}`);
      throw error;
    }
  }

