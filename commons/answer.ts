import dotenv from 'dotenv';
dotenv.config();

let answer = {}


async function sendRequest(url: string, data: any): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}


async function captureFlag(taskName: string, response: any) {

    console.log("CENTRALA_URL: "+process.env.CENTRALA_URL)

    let data = {
        "task": taskName,
        "apikey": process.env.CENTRALA_API_KEY,
        "answer": response
    }

    return await sendRequest(process.env.CENTRALA_URL as string, data);
}


export { captureFlag };