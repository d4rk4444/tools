import Web3 from 'web3';
import { privateToAptosAddress } from './web3.js';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();


export const timeout = ms => new Promise(res => setTimeout(res, ms));

export function generateRandomAmount(min, max, num) {
    const amount = Number(Math.random() * (max - min) + min);
    return Number(parseFloat(amount).toFixed(num));
}

export function parseFile(file) {
    let data = fs.readFileSync(file, "utf8");
    let array = data.split('\n');
    return array;
}

export async function createWallet(quantity) {
    const w3 = new Web3();
    for(let i = 0; i < quantity; i++) {
        const wallet = w3.eth.accounts.create()
        if (i === quantity - 1) {
            fs.writeFileSync("address.txt", `${wallet.address}`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `${wallet.privateKey}`, { flag: 'a+' });
        } else {
            fs.writeFileSync("address.txt", `${wallet.address}\n`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `${wallet.privateKey}\n`, { flag: 'a+' });
        }
        await timeout(250);
        console.log(`Create/Save ${i+1} wallet`);
    }
    await timeout(250);
    console.log('Ready!');
}

export async function createAptosAddressFile() {
    const wallets = parseFile('private.txt');
    for (let i = 0; i < wallets.length; i++) {
        if (wallets.length > 0) {
            fs.writeFileSync("aptosAddress.txt", `\n${privateToAptosAddress(wallets[i].slice(2, wallets[i].length))}`, { flag: 'a+' });
        } else if (i === wallets.length - 1) {
            fs.writeFileSync("aptosAddress.txt", `${privateToAptosAddress(wallets[i].slice(2, wallets[i].length))}`, { flag: 'a+' });
        } else {
            fs.writeFileSync("aptosAddress.txt", `${privateToAptosAddress(wallets[i].slice(2, wallets[i].length))}\n`, { flag: 'a+' });
        }
    }
    console.log('File ready!');
}

export const chainRpc = {
    Ethereum: '',
    BSC: '',
    Polygon: 'https://rpc-mainnet.matic.quiknode.pro', //https://polygon.llamarpc.com',
    Avalanche: 'https://rpc.ankr.com/avalanche',
    Arbitrum: 'https://arb1.arbitrum.io/rpc',
    Aptos: 'https://fullnode.mainnet.aptoslabs.com',
}

export const chainExplorerTx = {
    Ethereum: 'https://etherscan.io/tx/',
    BSC: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
    Avalanche: 'https://snowtrace.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    Aptos: 'https://explorer.aptoslabs.com/txn/',
}

export const chainContract = {
    Avalanche: { 
        WAVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        BTCB: '0x152b9d0fdc40c096757f570a51e494bd4b943e50',
        USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        traderJoe: '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3',
        BTCbRouter: '0x2297aebd383787a160dd0d9f71508148769342e3',
        StargateRouter: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
        AptosRouter: '0xa5972eee0c9b5bbb89a5b16d1d65f94c9ef25166'
    },
    Arbitrum: {
        BTCB: '0x2297aEbD383787A160DD0d9F71508148769342E3',
        BTCbRouter: '0x2297aebd383787a160dd0d9f71508148769342e3',
    },
    Polygon: {
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        StargateRouter: '0x45a01e4e04f14f7a4a6702c74187c5f6222033cd',
        AptosRouter: '0x488863d609f3a673875a914fbee7508a1de45ec6'
    },
    approveAmount: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
}

export const startScript = `
       __  __    __            __        __    __  __    __  __    __ 
      /  |/  |  /  |          /  |      /  |  /  |/  |  /  |/  |  /  |
  ____$$ |$$ |  $$ |  ______  $$ |   __ $$ |  $$ |$$ |  $$ |$$ |  $$ |
 /    $$ |$$ |__$$ | /      \  $$ |  /  |$$ |__$$ |$$ |__$$ |$$ |__$$ |
/$$$$$$$ |$$    $$ |/$$$$$$  |$$ |_/$$/ $$    $$ |$$    $$ |$$    $$ |
$$ |  $$ |$$$$$$$$ |$$ |  $$/ $$   $$<  $$$$$$$$ |$$$$$$$$ |$$$$$$$$ |
$$ \ __$$ |      $$ |$$ |      $$$$$$  \        $$ |      $$ |      $$ |
$$    $$ |      $$ |$$ |      $$ | $$  |      $$ |      $$ |      $$ |
 $$$$$$$/       $$/ $$/       $$/   $$/       $$/       $$/       $$/                                                            
`