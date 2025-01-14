import { llmCallChat } from "@/commons/llmapi";
import { whereIsTheDroneMessege } from "./prompts";

export async function whatsBelow(instructions: string) {

    const response = await llmCallChat(whereIsTheDroneMessege(), instructions, 'json_object') as any;
    return response;
}
