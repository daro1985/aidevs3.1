
export const answerQuestionsUserPrompt = ({question, databaseStructure}: {question: string, databaseStructure: any}) => 
    { 
        return `Quesition: ${question} Database structure: ${JSON.stringify(databaseStructure, null, 2)}`;
    }

export const answerQuestionsSystemPrompt = `
Your goal is to analize given database structure and generate select query to get data for given question.
<prompt_rules>
FOCUS database structure and tables
ANALYZE given data samples
REPLY with valid JSON object
Do not add any additional text or characters.
AVOID adding json or tylda characters.
<prompt_rules>
<example_response>
{"query": "SELECT * FROM employees WHERE is_active = 0;"}
</example_response>
`;