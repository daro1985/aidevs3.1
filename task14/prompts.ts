
export const extractInfoUserPrompt = (document: string) => 
    { 
        return `Document to analize: ${document}`
    }

export const extractInfoSystemPrompt = `
Your goal is to analize given document and extract information about people and places.
<prompt_rules>
FOCUS on people names and places
OMIT any other information including SURNAME, LAST NAME, etc.
ALWAYS use denominators for all names
ALWAYS use UPPER CASE for all names
REPLY with valid JSON object
Do not add any additional text or characters.
AVOID adding json or tylda characters.
DO NOT USE POLISH CHARACTERS LIKE Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż
<prompt_rules>
<example_response>
{"people": ["MATEUSZ", "BRONISLAW", "STANISLAW"], "places": ["SLASK", "OLSZTYN", "POMORZE"]}
</example_response>
`;