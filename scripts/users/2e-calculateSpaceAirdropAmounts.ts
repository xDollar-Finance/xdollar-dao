import fs from "fs";
import Balances from "./troves_balances.json";
import {mapToObj} from "./utils/helpers";

const AirdropAmount = 50000 * 1e18 // 50,000 space to trove owners each week, ~ 200,000 per month, 10% of 2M emission

calculateAirdropAmounts()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

async function calculateAirdropAmounts() {
    let airdropAmounts: Map<string, string> = new Map<string, string>()

    for (let i = 0; i < Balances.length; i++) {
        let amount = Math.round(Balances[i].ve_hnd_share * AirdropAmount)
        if (amount >= (0.1 * 1e18)) {
            airdropAmounts.set(
                Balances[i].user,
                BigInt(Math.round(Balances[i].ve_hnd_share * AirdropAmount)).toString()
            )
        }
    }

    console.log(`Found ${airdropAmounts.size} users`)

    fs.writeFileSync(`./scripts/users/space_airdrop.json`,
        JSON.stringify(mapToObj(airdropAmounts), null, 4)
    );
}