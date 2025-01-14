import OpenAI from "openai";
import dotenv from 'dotenv';
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

dotenv.config();

const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });


async function llmCall(data: string, systemPrompt: string, userPrompt: string) {


        const prompt = userPrompt +" "+data;
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', 
                        content: systemPrompt },
                    { role: 'user', 
                        content: prompt },
                ],
            });
            
            //console.log(`File: ${filePath}`);
           // console.log(`Response: ${response.choices[0].message.content}`);

            return response.choices[0].message.content;
        } catch (err) {
            console.error(err);
        }

}

async function llmCallv2(systemPrompt: string, userPrompt: string) {
  
    console.log("###userPrompt:", userPrompt);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }

    

}

async function llmCallEmbedding(data: string) {

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: data,
        });
        return response.data[0].embedding;
    } catch (err) {
        console.error(err);
    }
}

async function llmCallImage(systemPrompt: string, userPrompt: string) {
  
    console.log("###userPrompt:", userPrompt);
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: JSON.parse(userPrompt) },
            ],
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }

    

}

async function llmCallChat(messages: ChatCompletionMessageParam[], prompt: string, mode: any  = 'text') {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'user', content: prompt },
            ...messages,
        ],
        response_format: { type: mode },
    });
    //console.log("###llmCallChat response", response.choices[0].message.content);
    return response.choices[0].message.content;
}

export { llmCall, llmCallEmbedding, llmCallv2, llmCallImage, llmCallChat };
