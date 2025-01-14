import { llmCallChat } from "../commons/llmapi.ts";
import { whereIsTheDroneMessege } from "./prompts.ts";

export async function whatsBelow(instructions: string) {

    const response = await llmCallChat(whereIsTheDroneMessege(), instructions, 'json_object') as any;
    return response;
}
