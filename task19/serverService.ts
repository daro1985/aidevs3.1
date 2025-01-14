import express, { Request, Response, NextFunction } from 'express';
import * as path from 'node:path';
import dotenv from 'dotenv';
import axios from 'axios';  
import { whatsBelow } from './mapService.ts';
import * as util from 'node:util';


export async function startServer() {

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
 //   app.use(express.static(path.join(__dirname, '../public')));

    app.get('/', (req: Request, res: Response) => {
        res.send('Server is running...');
    });

    app.get('/start', async (req: Request, res: Response) => {
        const response = await axios.post(`http://localhost:${port}/chat`, {
            instructions: "Poleciałem maksymalnie w lewo, a potem na sam dół."
        });
        
        res.send(response.data);
    });

    app.post('/chat', async (req: Request, res: Response) => {
        console.log("####Req:", util.inspect(req.body, { depth: null, colors: true }));
        try {
            const response = await whatsBelow(req.body.instructions);    
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
