import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

export const planPrompt = () => { 
 return `
        You are a helpful assistant whos task is to choose the next action to take.

        <prompt_rules>
        CHOOSE ONLY ONE ACTION TO TAKE.
        CHOOSE between the following actions:
            - FIND: identify photos filenames and locations
            - ANALYZE: analyze photos quality and usability, suggest improvements
            - DRAFT: identify a person on photos and draft a persons description
            - CAPTURE: capture a flag
        Stick to the following rules:
            IF user's response is a free text with kind of hints how to find photos RETURN FIND.
            IF user's response is an array of urls in JSON format with nextstep: ANALYZE RETURN ANALYZE.
            IF user's response is an array of urls in JSON format with nextstep: DRAFT RETURN DRAFT.
            IF user's response is a hint how to draft a person RETURN DRAFT.
        Always return a valid JSON object without formatting.
        </prompt_rules>

        <example>
        {
            "action": "ANALYZE"
        }
        </example>
    `
}


export const findPrompt = () => {
    return `
        You are an assistant who's task is to find the images location in the user's response.

        <prompt_objective>
            Your task is to analyze user's response, find the way to get all images and return the list of urls.
        </prompt_objective>

        <prompt_rules>
            ANALYZE user's response and find the way to get all images.
            RETURN list of urls.
            ALWAYS RETURN ALL urls.
            IF THERE is filename only, find a common pattern and return full url.
            Suggest next step to take:
                - ANALYZE if user sends new images
                - DRAFT if user sends corrected images
            ALWAYS RETURN VALID JSON object
            DO NOT USE markdown blocks.
        </prompt_rules>

        <prompt_example>
            INPUT: "I have some images  named IMG1, IMG2, IMG3 all PNGs located at https://example.com/folder/."
            OUTPUT: {
            nextstep: "ANALYZE",
            links:[ 
                "https://example.com/folder/IMG_1.PNG", 
                "https://example.com/folder/IMG_2.PNG", 
                "https://example.com/folder/IMG_3.PNG" 
            ] }



            INPUT: "I have corrected some of photos. They are named IMG1_FG, IMG2_FC, IMG3_FX all PNGs located at https://example.com/folder/."
            OUTPUT: {
            nextstep: "DRAFT",
            links:[ 
                "https://example.com/folder/IMG_1.PNG", 
                "https://example.com/folder/IMG_2.PNG", 
                "https://example.com/folder/IMG_3.PNG" 
            ] }
        </prompt_example>


    `;
}

export const analyzePromptSystem =  () => {
    return `
        You are an assistant who's task is to decide how to correct provided images.

        <prompt_objective>
            Your task is to analyze provided images and if necessary decide how to correct it using one of the following methods: REPAIR, DARKEN, BRIGHTEN.
        </prompt_objective>

        <prompt_rules>
            ANALYZE images in provided links array in terms of its quality and usability to interpret its content.
            CHOOSE between REPAIR, DARKEN, BRIGHTEN, SKIP actions available to you.
            IF image is not usable, RETURN REPAIR.
            IF image is too dark, RETURN BRIGHTEN.
            IF image is too bright, RETURN DARKEN.
            IF the image is fine, do not return anything.
            RETURN best action for each image.
            ALWAYS RETURN VALID JSON object including action and filename
            DO NOT USE markdown blocks.
        </prompt_rules>

        <prompt_example>
            OUTPUT example1:
            {   actions: [
                "BRIGHTEN image1.jpg",
                "DARKEN image2.jpg"
               ]
            }

            OUTPUT example2: 
            {
                actions: [
                "DARKEN image1.jpg",
                "DARKEN image2.jpg",
                "BRIGHTEN image3.jpg"
               ]
            }
        </prompt_example>
    `;
}
export const analyzePromptData = (urls: string[]) => {
   
    let content: string = "[";
    for (let url of urls) {
        content = content.concat(
            `{
                "type": "image_url",
                "image_url": {
                    "url": "${url}",
                    "detail": "high"
                }
            },`
        )
    }
    content = content.concat(`
        {
            "type": "text",
            "text": "Decide how to correct this image."
        }
    ]
    `)
    return content;
}

export const draftPrompt = () => {
    return `
        You are an assistant who's task is to describe the person in the set of images.

        <prompt_objective>
            Your task is to analyze set of images and return description of the person in the set.
        </prompt_objective>

        <prompt_rules>
            ANALYZE set of images and return description of the person in the set.
            PERSON we are looking for is a woman named Barbara
            BE AS DETAILED AS POSSIBLE
            WRITE AT LEAST 100 WORDS
            RETURN description of the person in the set.
            IF some of the images does not fit, ignore them.
            ALWAYS RETURN VALID string
            DO NOT USE markdown blocks.
            ANSWER IN POLISH ONLY
        </prompt_rules>

        <prompt_example>
            OUTPUT: "Barbara ma krótnie czarne włosy i pomarszczone czoło. Jest wysoka i ma duże oczy. Ubrana jest w czarny kombinezon."
        </prompt_example>
    `
}

export const planMessage: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: planPrompt()
    }
  ]

export const findMessage: ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: findPrompt()
    }
]

export const analyzeMessage: ChatCompletionMessageParam[] =  [
        {
            role: 'system',
            content: analyzePromptSystem()
        }
]

export const draftMessage: ChatCompletionMessageParam[] =  [
    {
        role: 'system',
        content: draftPrompt()
    }
]