import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const defaultResources: string[] = [
    "https://softo.ag3nts.org/"
  ];

export const defaultTools: any[] = [
  //  { name: 'REPLAN', description: 'Use this tool only when you need determine the question to be answered.' },
    { name: 'LOOKUP', description: 'Use this tool only when you know the question and you need to find the answer on the webpage.' },
   // { name: 'upload', description: 'Use this tool only when you need to upload a file to the server. You can upload a file in a form of a path or a url.' },
   // { name: 'REPLY', description: 'This tool MUST be always used as the last tool. Use this tool to provide the answer to the user.' }
];

export const planPrompt = (resources: string[], tools: any[] ) => {
    const prompt = `
    You are a helpful assistant that can answer questions based on the provided webpages provided in the <urls> section.

    <prompt_objective>
    Analyze the latest user message and conversation context to generate a JSON object containing a thinking process and action plan. This is part of an internal thinking process that focuses on making a plan. The user CANNOT see these responses due to the system design.
    </prompt_objective>

    <prompt_rules>
    - GENERATE a JSON object with the structure: {"_thinking": string, "plan": [{"tool": string, "query": string}]}
    - ALWAYS focus on the latest user message while considering the conversation context
    - EXTRACT ALL relevant details from the user's message
    - FORMULATE queries as self-commands (e.g., "answer question no. ..." or "look up ... on the webpage ..." or "answer ... based on ..."  etc.)
    - ENSURE the "_thinking" field explains the analysis and reasoning process
    - INCLUDE ALL mentioned details in the queries
    - DISTINGUISH actions already taken from those still needed based on the conversation context
    - USE ONLY the tools provided in the <tools> section
    - ALWAYS include the resources for the lookup tool based on the resources provided in the <resources> section
    - ALWAYS include empty subplan for the lookup tool
    </prompt_rules>

    <prompt_examples>
    USER: 01. What is the capital of France? 02. What is the population of Poland? 03. How many people live in the world?
    AI: {
    "thinking": "The user asked three questions, so I need to find the answers to all of them. I will start with the first question using the lookup tool, then the second question using the lookup tool and finally the third question using the lookup tool. Having all the answers, I will use the reply tool to provide the answers to the user.",
    "plan": [
    {   
        "tool": "LOOKUP",
        "query": "Answer question no. 1: What is the capital of France?"
        "resources": ["${defaultResources[0]}/france.html"]
        "subplan": []       
    },
    {
        "tool": "LOOKUP",
        "query": "Answer question no. 2: What is the population of Poland?"
        "resources": ["${defaultResources[0]}/poland.html"]
        "subplan": []
    },
    {
        "tool": "LOOKUP",
        "query": "Answer question no. 3: How many people live in the world?
        "resources": ["${defaultResources[0]}/world.html"]
        "subplan": []
    }
    ]
    }
    </prompt_examples>

    <tools>
    ${tools.map(tool => `<tool>${tool.name}: ${tool.description}</tool>`).join('\n')}
    </tools>

    <resources>
    ${resources.map(resource => `<resource>${resource}</resource>`).join('\n')}
    </resources>

    `
    return prompt;
}


export function planMessage(resources: string[]= defaultResources, tools: any[] = defaultTools): ChatCompletionMessageParam[] {
    const message: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: planPrompt(resources, tools)
            }
        ]
    return message;
}