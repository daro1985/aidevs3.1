import { llmCallChat } from '../commons/llmapi';
import { testDriveMessege, testDrivePrompt, whereIsTheDroneMessege } from './prompts';

async function generateTests() {
    const response = await llmCallChat(testDriveMessege(), "Generate 3 tests for the test drive", 'json_object') as any;
    return JSON.parse(response);
}
//  const response = await llmCallChat(whereIsTheDroneMessege(),"What is the object below the drone?", 'json_object') as any;


async function main() {
    const tests = await generateTests();
    console.log("Generated tests:", tests);

    for (const test of Object.values(tests)) {
        const response = await llmCallChat(whereIsTheDroneMessege(), test as string, 'json_object') as any;
        console.log("Response:", response);
    }

}


main(); 