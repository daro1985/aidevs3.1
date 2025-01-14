import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { answer, execute, plan, reply, ReplyTo } from './botService';
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

    const request= await reply(ReplyTo.API, "START");
    console.log("####Request:", request);
    const response =  await reply(ReplyTo.SELF, request.message);
    res.send("Request sent to chat service: " + JSON.stringify(response, null, 2) );
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
        
       
        const actions = await plan(request);
        console.log("####Actions:", actions);
        const results = await execute(actions, request);
        console.log("####Results:", results);
        const completion = await answer(actions, results);
        res.send(completion);

    } catch (error) {
        //console.error(error);
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

