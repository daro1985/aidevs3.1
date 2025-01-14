


export const imageLocationPrompt = () => {
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
            ALWAYS RETURN VALID array of strings 
            DO NOT USE markdown blocks.
        </prompt_rules>

        <prompt_example>
            INPUT: "I have some images  named IMG1, IMG2, IMG3 all PNGs located at https://example.com/folder/."
            OUTPUT: [ 
                "https://example.com/folder/IMG_1.PNG", 
                "https://example.com/folder/IMG_2.PNG", 
                "https://example.com/folder/IMG_3.PNG" 
                ] 
            }
        </prompt_example>


    `;
}


export const imageCorrectionPrompt = (filename: string) => {
    return `
        You are an assistant who's task is to decide how to correct provided images.

        <prompt_objective>
            Your task is to analyze provided image and if necessary decide how to correct it using one of the following methods: REPAIR, DARKEN, BRIGHTEN.
        </prompt_objective>

        <prompt_rules>
            ANALYZE image in terms of its quality and usability to interpret its content.
            CHOOSE between REPAIR, DARKEN, BRIGHTEN, SKIP actions available to you.
            IF image is not usable, RETURN REPAIR.
            IF image is too dark, RETURN BRIGHTEN.
            IF image is too bright, RETURN DARKEN.
            IF the image is fine, RETURN SKIP.
            RETURN best action to be taken.
            ALWAYS RETURN VALID string including action and ${filename}
            DO NOT USE markdown blocks.
        </prompt_rules>

        <prompt_example>
            OUTPUT example1: 
                "BRIGHTEN ${filename}"

            OUTPUT example2: 
                "DARKEN ${filename}"

            OUTPUT example3: 
                "REPAIR ${filename}"
        </prompt_example>


    `;
}

export const imageCorrectionPromptUser = (urls: string[]) => {
   
        let content: string = "[";
     //   console.log("###urls:", urls);
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
           // console.log("###content for url:", url, '###', content);
        }
        content = content.concat(`
            {
                "type": "text",
                "text": "Decide how to correct this image."
            }
        ]
        `)
       // console.log("###content:", content);
        return content;
}


export const describePersonPrompt = () => {
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