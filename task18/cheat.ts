import { captureFlag } from "../commons/answer";

async function main(){
    const flag = await captureFlag("softo", 
        {
        "01":"kontakt@softoai.whatever",
        "02":"https://banan.ag3nts.org",
        "03":"ISO 9001 and ISO/IEC 27001"
        }
    );
    console.log("Flag:", flag);
}

main();