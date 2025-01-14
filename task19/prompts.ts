import { ChatCompletionMessageParam } from "openai/resources/chat/completions"

export const whereIsTheDronePrompt = `
You are helping a drone pilot to find an object on the grid. You are given a 4x4 grid, assuming the drone is always starting from the START position try to find the object based on the users description.

<prompt_objective>
    You are given a 4x4 grid represented as an array. You need to find an object on the grid below the drone, based on users description.
</prompt_objective>
<prompt_rules>
    - The grid is always starting from the START position.
    - The grid is always 4x4.
    - The grid is always in polish language.
    - return the position of the object in the grid in JSON format.
    - ALWAYS return the thinking process and description of the object in the grid.
</prompt_rules>
<grid>
[
    ['START','trawa', 'drzewo', 'dom'],
    ['trawa', 'wiatrak', 'trawa', 'trawa'],
    ['trawa', 'trawa', 'skały', 'drzewa'],
    ['góry', 'góry', 'samochód', 'jaskinia']
  ]
</grid>

<example_output>
    {"thinking": "Drone moved 2 fields to the right and 1 field to the bottom.","description": "trawa"}
    {"thinking": "Drone moved 3 fields to the right and 1 field to the bottom and 2 to the left.","description": "wiatrak"}
</example_output>
`
export function whereIsTheDroneMessege(): ChatCompletionMessageParam[] {
    return [
        { role: 'system', content: whereIsTheDronePrompt }
    ]   
}

export const testDrivePrompt = `
    You are writing a tests of drone in a game. Drone is a flying robot which can fly in a 2D space on a 4x4 grid.
    
    <prompt_objective>
        Write a set of different tests for the drone using natural language. Drone can move up, down, left, right.
        The tests should be written in a way that is easy to understand and follow.
        Test shuld be written in polish language.
        YOU ALWAYS START FROM THE START POSITION.
        ALWAYS return the tests in JSON format.
    </prompt_objective>


    <prompt_rules>
        - The tests should be written in a way that is easy to understand and follow.
    </prompt_rules>

    <example_output>
        {
            "01": "Ruszyłem dwa pola w lewo, a potem jedno w górę.",
            "02": "Poszedłem jedno pole w dół, a następnie trzy w prawo.",
            "03": "Przesunąłem się na samą górę, a potem jedno pole w lewo.",
            "04": "Skoczyłem trzy pola w prawo, a potem dwa w dół.",
            "05": "Zrobiłem krok w lewo, a potem na samą górę.",
            "06": "Przemieściłem się na sam dół, a następnie dwa pola w prawo.",
            "07": "Poszedłem jedno pole w górę, a potem jedno w lewo.",
            "08": "Ruszyłem się dwa pola w dół, a potem na samą prawą stronę.",
            "09": "Przeszedłem trzy pola w lewo, a następnie jedno w górę.",
            "09": "Przesunąłem się jedno pole w prawo, a potem dwa w dół.",
            "10": "Poleciałem w prawo i skończyłem na przedostanim polu",
            "11": "Przeszedłem trzy pola w lewo, a następnie jedno w górę.",
            "12": "Przesunąłem maksymalnie w prawo i minimalnie w dół.",
            "13": "Ruszyłem się dwa pola w dół, a potem na samą prawą stronę.",
            "14": "Poleciałem w prawy dolny róg.",
            "15": "Przesunąłem się jedno pole w prawo, a potem dwa w dół."
        }
    </example_output>
    <grid>
[
    ['START','x', 'x', 'x'],
    ['x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x']
  ]
</grid>

`
export function testDriveMessege(): ChatCompletionMessageParam[] {
    return [
        { role: 'system', content: testDrivePrompt }
    ]   
}
