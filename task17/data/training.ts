import * as fs from 'fs';
import * as path from 'path';

function createTrainingData() {
    // Read the files
    const correctData = fs.readFileSync(path.join(__dirname, 'lab_data/correct.txt'), 'utf-8')
        .split('\n')
        .filter(line => line.trim());

    const incorrectData = fs.readFileSync(path.join(__dirname, 'lab_data/incorrect.txt'), 'utf-8')
        .split('\n')
        .filter(line => line.trim());

    const trainingData = [];

    // Process correct examples
    for (const line of correctData) {
        const numbers = line.split(',').map(Number);
        trainingData.push({
            messages: [
                {
                    role: "system",
                    content: "You are a mathematical pattern validator."
                },
                {
                    role: "user",
                    content: `Analyze if this sequence follows the pattern: ${numbers.join(', ')}`
                },
                {
                    role: "assistant",
                    content: "Yes, this sequence follows the correct pattern."
                }
            ]
        });
    }

    // Process incorrect examples
    for (const line of incorrectData) {
        const numbers = line.split(',').map(Number);
        trainingData.push({
            messages: [
                {
                    role: "system",
                    content: "You are a mathematical pattern validator."
                },
                {
                    role: "user",
                    content: `Analyze if this sequence follows the pattern: ${numbers.join(', ')}`
                },
                {
                    role: "assistant",
                    content: "No, this sequence does not follow the correct pattern."
                }
            ]
        });
    }

    // Write to JSONL file
    const outputPath = path.join(__dirname, 'training.jsonl');
    const jsonlContent = trainingData.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(outputPath, jsonlContent);

    console.log(`Training data generated with ${trainingData.length} examples`);
}

createTrainingData();
