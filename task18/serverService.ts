import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { act, plan, ReplyTo } from './agentService';   
import { getData, readFile } from './commonTools';
import fs from 'fs/promises';
import axios from 'axios';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running...');
});

app.get('/start', async (req: Request, res: Response) => {
    const questionsFilePath = path.join(__dirname, 'questions.json');
    let questions;
    try {
        await fs.access(questionsFilePath);
        questions = await readFile(questionsFilePath);
    } catch {
        questions = await getData();
    }
  
        const response = await route(ReplyTo.SELF, questions);
        res.send("Request sent to chat service: " + JSON.stringify(response, null, 2));
    

    
});

app.post('/chat', async (req: Request, res: Response) => {
    //await fs.writeFile("prompt.md", "");
    console.log("####Req:", req.body);
    try {
        // const { messages, conversation_uuid = uuidv4()  } = req.body;
        // const filteredMessages = messages.filter(
        //   (msg: any) => msg.role !== "system"
        // );
  
        const request = JSON.stringify(req.body, null, 2)   
        console.log("####Request:", request);
        let theplan = await plan(request);
        console.log("####The plan is:", theplan);
        const results = await act(theplan);
       // const responseData = JSON.stringify(results);
        //console.log("####Results:", results);
        //const completion = await decide(actions, results);
        res.send(results);

    } catch (error) {
        console.error(error);
        res.status(500).send('Something broke!');
    }
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Page not found');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  //  console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});




export async function route(whom: ReplyTo, message: string){

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
          "user_message": message
        };
        break;
  
    }
    //console.log("####RequestBody:",whom," ", requestBody);
    try{
        const response = await axios.default.post(url, requestBody); 
        //console.log("####Response:", response.data);
        return response.data;
    }
    catch(error){
        console.log("Error:", error);
        return error;
    }
}
