import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import fs from "fs";


const XIM_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]

const XIM_ADDRESS = "0xec690cdd448e3cbb51ed135df72301c3265a8f80"
const MULTISIG_WALLET = "0xfBbeCD73d1feC645e477d4b7796349f73Dd4d5ab"

const getAmount = async () => {
    const provider = new JsonRpcProvider("https://babel-api.mainnet.iotex.io");
    const xim_contract = new ethers.Contract(XIM_ADDRESS, XIM_ABI, provider);

    const fromBlock = 15463658 //2022-01-24 00:00:00 AM +UTC
    const toBlock = 15717147  //2022-02-07 00:00:00 AM +UTC

    const filter = xim_contract.filters.Transfer();
    const blockBatch = 1000
    let currentFromBlock = fromBlock
    let currentToBlock = fromBlock + blockBatch
    const balances = new Map<any, any>();
    while (currentToBlock < toBlock) {
        try {
            const events = await xim_contract.queryFilter(filter, currentFromBlock, currentToBlock);
            for (const e of events) {
                const from = e.args?.from;
                const to = e.args?.to;
                const value = e.args?.value;
                if (from != MULTISIG_WALLET && to != MULTISIG_WALLET) continue;
            //    console.log(from + " " + to + " " + value);
            //    fs.appendFileSync("xim_amount.csv", `${from}, ${to}, ${value}\n`)

                balances.set(from, (balances.has(from)? balances.get(from):0) - value / 1e18);
                balances.set(to, (balances.has(to)? balances.get(to):0) + value / 1e18);
                console.log(from + " " + to + " " + value / 1e18);
            }
        }
        catch (error) {
            if (error) continue;
        }
        // console.log("current:" + currentToBlock)
        currentFromBlock = currentToBlock
        currentToBlock += blockBatch
    }
    balances.forEach((v, k) => fs.appendFileSync("./scripts/users0207/xim_amount.csv", `${k}, ${v}\n`));
}

getAmount() 