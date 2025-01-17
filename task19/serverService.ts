import express, { Request, Response, NextFunction } from 'express';
import * as path from 'node:path';
import dotenv from 'dotenv';
import axios from 'axios';  
import { whatsBelow } from './mapService.ts';
import * as util from 'node:util';
import { captureFlag } from '../commons/answer.ts';


export async function startServer() {

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || "localhost";
    const endpoint = `https://${host}/chat`

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
 //   app.use(express.static(path.join(__dirname, '../public')));

    app.get('/', (req: Request, res: Response) => {
        res.send('Server is running...');
    });

    app.get('/start', async (req: Request, res: Response) => {
        // const response = await axios.post(`https://${host}/chat`, {
        //     instructions: "Poleciałem maksymalnie w lewo, a potem na sam dół."
        // });
        // console.log("#dziala#");
        const response = await captureFlag("webhook",endpoint)
        console.log("Response:", response);
        res.send("Endpoint sent: " + response);
    });

    app.post('/chat', async (req: Request, res: Response) => {
        console.log("####Req:", util.inspect(req.body, { depth: null, colors: true }));
        try {
            const response = await whatsBelow(req.body.instruction);    
            console.log("####Response:", util.inspect(response, { depth: null, colors: true }));
            res.send(response);
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

}
