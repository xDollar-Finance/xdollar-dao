import { JsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import fs from "fs";
import {mapToObj} from "./utils/helpers";


const BORROWER_OPERATION_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_borrowingFeePool",
        "type": "address"
      }
    ],
    "name": "BorrowingFeePoolChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_collTokenAddress",
        "type": "address"
      }
    ],
    "name": "CollTokenAddressChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_LUSDFee",
        "type": "uint256"
      }
    ],
    "name": "LUSDBorrowingFeePaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_stableCollActivePoolAddress",
        "type": "address"
      }
    ],
    "name": "StableCollActivePoolAddressChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_newStableCollTroveManagerAddress",
        "type": "address"
      }
    ],
    "name": "StableCollTroveManagerAddressChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "arrayIndex",
        "type": "uint256"
      }
    ],
    "name": "TroveCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_debt",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_coll",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum StableCollBorrowerOperations.BorrowerOperation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "TroveUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "BORROWING_FEE_FLOOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "BRIDGE_SWAP_COLLATERAL_RARIO",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CCR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "COLL_DEBT_CEILING",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DECIMAL_PRECISION",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LUSDToken",
    "outputs": [
      {
        "internalType": "contract ILUSDToken",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LUSD_GAS_COMPENSATION",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MCR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_NET_DEBT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_SWAP_NET_DEBT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MSCR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NAME",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PERCENT_DIVISOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STABLE_COLL_BORROWING_RATE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STABLE_COLL_COLLATERAL_RARIO",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STABLE_COLL_COLLATERAL_RARIO_DIVIDEND",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STABLE_COLL_COLLATERAL_RARIO_DIVISOR",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "STABLE_COLL_DEBT_CEILING",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_100pct",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "activePool",
    "outputs": [
      {
        "internalType": "contract IActivePool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_StableCollAmount",
        "type": "uint256"
      }
    ],
    "name": "addColl",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_LUSDChange",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isDebtIncrease",
        "type": "bool"
      }
    ],
    "name": "adjustTrove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "borrowingFeePool",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "closeTrove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "defaultPool",
    "outputs": [
      {
        "internalType": "contract IDefaultPool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_debt",
        "type": "uint256"
      }
    ],
    "name": "getCompositeDebt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEntireSystemColl",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEntireSystemDebt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEntireSystemStableColl",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getEntireSystemStableDebt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum StableCollBorrowerOperations.Functions",
        "name": "_fn",
        "type": "uint8"
      }
    ],
    "name": "lockFunction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_LUSDAmount",
        "type": "uint256"
      }
    ],
    "name": "openTrove",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceFeed",
    "outputs": [
      {
        "internalType": "contract IPriceFeed",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_LUSDAmount",
        "type": "uint256"
      }
    ],
    "name": "repayLUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_stableCollTroveManagerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_stableCollActivePoolAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_LUSDTokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_collTokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_collDecimalAdjustment",
        "type": "uint256"
      }
    ],
    "name": "setAddresses",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_borrowingFeePool",
        "type": "address"
      }
    ],
    "name": "setBorrowingFeePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stableCollActivePool",
    "outputs": [
      {
        "internalType": "contract IStableCollActivePool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "stableCollTroveManager",
    "outputs": [
      {
        "internalType": "contract IStableCollTroveManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum StableCollBorrowerOperations.Functions",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "timelock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum StableCollBorrowerOperations.Functions",
        "name": "_fn",
        "type": "uint8"
      }
    ],
    "name": "unlockFunction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_StableCollAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawColl",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_LUSDAmount",
        "type": "uint256"
      }
    ],
    "name": "withdrawLUSD",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const BORROWER_OPERATION_ADDRESS = "0xFB205B78a07CC976546F86d7428675f3CbA22AF7"


const getAverageBalances = async () => {
    const provider = new JsonRpcProvider("https://babel-api.mainnet.iotex.io");
    const bo = new ethers.Contract(BORROWER_OPERATION_ADDRESS, BORROWER_OPERATION_ABI, provider);

    const deploymentBlock = 15063534 // 2021-12-31T01:18:00.000Z
    const fromBlock = 15463658 //2022-01-24 00:00:00 AM +UTC
    const toBlock = 15717147 //2022-02-07 00:00:00 AM +UTC

    const filter = bo.filters.TroveUpdated();
    const blockBatch = 1000
    let currentFromBlock = deploymentBlock
    let currentToBlock = deploymentBlock + blockBatch
    const snapshotNumber = 7;
    const blockGap = (toBlock - fromBlock) / snapshotNumber;
    let snapShotBlocks: Array<number> = [fromBlock + blockGap, fromBlock + blockGap * 2, fromBlock + blockGap * 3, fromBlock + blockGap * 4, fromBlock + blockGap * 5, fromBlock + blockGap * 6, fromBlock + blockGap * 7];

    const currentColl = new Map<string, BigNumber>();
    const totalColl = new Map<string, BigNumber|undefined>();
    while (currentToBlock < toBlock) {
        try {
            const events = await bo.queryFilter(filter, currentFromBlock, currentToBlock);
            for (const e of events) {
                const borrower: string = e.args?._borrower;
                const coll: BigNumber = e.args?._coll;
                console.log("error:" + borrower + " " + coll);

            //    console.log(from + " " + to + " " + value);
            //    fs.appendFileSync("xim_amount.csv", `${from}, ${to}, ${value}\n`)
                currentColl.set(borrower, coll);
            }
        }
        catch (error) {
            if (error) continue;
        }
        
        for (let i = 0; i < snapShotBlocks.length; i++) {
            if (currentFromBlock <= snapShotBlocks[i] && currentToBlock > snapShotBlocks[i]){
                for (const entry of currentColl.entries()) {
                  let key = entry[0];
                  let value = entry[1];
                  if (totalColl.has(key) && totalColl.get(key)) totalColl.set(key, totalColl.get(key)?.add(value));
                  else totalColl.set(key, value)
                  //  fs.appendFileSync("./scripts/users/wiotex_amount.csv", `${key}, ${currentColl.get(key)}\n`)
                  }
            }

        }
        
        console.log("current:" + currentToBlock)
        console.log(currentColl)
        console.log(totalColl)
        currentFromBlock = currentToBlock
        currentToBlock += blockBatch
    }

    /*
    let airdropPrice: Map<string, number> = new Map<string, number>();
    for (const entry of totalColl.entries()) {
      if(entry[1]) airdropPrice.set(entry[0], entry[1].toNumber());
    }

    console.log("this is another test:", airdropPrice)
    */

    const balances = Array.from(totalColl, function (item) {
      if(item[1])
      return { user: item[0], balance: Math.round(item[1]?.toNumber() / snapshotNumber / 1e6).toString() }
    });

    fs.writeFileSync(`./scripts/users0207/trove_col_value/usdt.json`, JSON.stringify(balances, null, 4));

    //totalColl.forEach((v, k) => fs.appendFileSync("./scripts/users/usdt_amount.csv", `${k}, ${v}\n`));
    
    /*
    fs.writeFileSync(`./scripts/users/wiotex_amount.json`,
        JSON.stringify(mapToObj(airdropPrice), null, 4)
    );
    */
    
}

getAverageBalances() 
