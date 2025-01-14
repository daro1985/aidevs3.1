
export const generateSummaryUserPrompt = `Generate summary based on document content:`;

export const generateSummarySystemPrompt = `
Generate summary of the given document using all informations and details including context.
<prompt_rules>
FOCUS on main subjects and objects from the document
ALWAYS response in polish
<prompt_rules>
`;

export const givenContextUserPrompt = `Describe the context of the given text based on document content:`;

export const givenContextSystemPrompt = `
Add context of the given text based on document content. 
<prompt_rules>
KEEP it short and concise. 
USE 1-2 sentences.
REMOVE empty lines.
REMOVE \n and \t characters.
ALWAYS use original language of the document and text. IF text is in polish, use polish.
<prompt_rules>
`;


export const generateKeywordsUserPrompt = `You are analyzing security report and you need to generate keywords based on given and context`;

export const generateKeywordsSystemPrompt = `
Generate keywords based on given rules:
<prompt_rules>
GENERATE as many keywords as possible.
EXTRACT sector name and number from filename
USE all nouns and names, and technologies
ALWAYS use polish language.
ALL keywords MUST be in the NOMINATIVE, SINGULAR form.
USE commas to separate keywords.
<prompt_rules>
<example>
Input: Sektor D jest jednym z najnowocześniejszych sektorów w fabryce. Jest on odpowiedzialny za produkcję i magazynowanie produktów. Sektor D posiada własne laboratorium, które jest odpowiedzialne za badania i rozwój nowych technologii. Sektor D posiada również własny system alarmowy, który jest odpowiedzialny za monitorowanie i zabezpieczenie sektora.
Output: magazyn, bezpieczeństwo, produkcja, laboratorium, monitoring, alarm 
</example>

`;