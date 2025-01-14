import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { captureFlag } from '../commons/answer';

dotenv.config({ path: path.join(__dirname, '../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeSequence(numbers: number[]) {
    try {
        const completion = await openai.chat.completions.create({
            model: "ft:gpt-4o-mini-2024-07-18:personal:task17:AnXLzlTn",
            messages: [
                {
                    role: "system",
                    content: "You are a mathematical pattern validator."
                },
                {
                    role: "user",
                    content: `Analyze if this sequence follows the pattern: ${numbers.join(', ')}`
                }
            ],
            temperature: 0,
            max_tokens: 50
        });

        const response = completion.choices[0].message.content;
        return response?.toLowerCase().includes('yes');
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        throw error;
    }
}

async function main() {
    try {
        // Read verify.txt
        const verifyData = fs.readFileSync(
            path.join(__dirname, 'data/lab_data/verify.txt'), 
            'utf-8'
        )
            .split('\n')
            .filter(line => line.trim());

        const correctSequences = [];

        // Process each sequence
        for (const line of verifyData) {
            // Extract sequence number and numbers from format "01=12,100,3,39"
            const [id, numbersStr] = line.split('=');
            const numbers = numbersStr.split(',').map(Number);

            // Analyze the sequence
            const isCorrect = await analyzeSequence(numbers);
            
            if (isCorrect) {
                correctSequences.push(id);
            }
        }

        // Output results
        console.log('Correct sequences:', correctSequences);

        // Send response to capture flag
        const response = await captureFlag('research', correctSequences);
        console.log('Capture flag response:', response);

    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
