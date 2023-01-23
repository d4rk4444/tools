import Web3 from 'web3';
import { privateToAptosAddress } from './web3.js';
import fs from 'fs';
import chalk from 'chalk';


export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const roundTo = (num, amount) => +(Math.round(num + `e+${amount}`)  + `e-${amount}`);

export const generateRandomAmount = (min, max, num) => {
    const amount = Number(Math.random() * (max - min) + min);
    return Number(parseFloat(amount).toFixed(num));
}

export const parseFile = (file) => {
    const data = fs.readFileSync(file, "utf-8");
    const array = (data.replace(/[^a-zA-Z0-9\n]/g,'')).split('\n');
    return array;
}

export const createWallet = async(quantity) => {
    const w3 = new Web3();
    for(let i = 0; i < quantity; i++) {
        const wallets = parseFile('private.txt');
        const wallet = w3.eth.accounts.create();
        if (wallets[0].length == 64) {
            fs.writeFileSync("address.txt", `\n${wallet.address}`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `\n${(wallet.privateKey).slice(2, wallet.privateKey.length)}`, { flag: 'a+' });
        } else if (wallets.length > 1) {
            fs.writeFileSync("address.txt", `\n${wallet.address}`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `\n${(wallet.privateKey).slice(2, wallet.privateKey.length)}`, { flag: 'a+' });
        } else if (i == wallets.length - 1) {
            fs.writeFileSync("address.txt", `${wallet.address}`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `${(wallet.privateKey).slice(2, wallet.privateKey.length)}`, { flag: 'a+' });
        } else {
            fs.writeFileSync("address.txt", `${wallet.address}\n`, { flag: 'a+' });
            fs.writeFileSync("private.txt", `${(wallet.privateKey).slice(2, wallet.privateKey.length)}\n`, { flag: 'a+' });
        }
        await timeout(100);
    }
    console.log(chalk.yellow('File ready!'));
}

export const createAptosAddressFile = async() => {
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

export const rpc = {
    Ethereum: 'https://rpc.ankr.com/eth	',
    BSC: 'https://bsc-dataseed.binance.org',
    Polygon: 'https://rpc-mainnet.matic.quiknode.pro',
    Avalanche: 'https://rpc.ankr.com/avalanche',
    Arbitrum: 'https://arb1.arbitrum.io/rpc',
    Optimism: 'https://mainnet.optimism.io',
    Fantom: 'https://rpc3.fantom.network',
    Moonbeam: 'https://rpc.ankr.com/moonbeam',
    Aptos: 'https://fullnode.mainnet.aptoslabs.com',
    Goerli: 'https://eth-goerli.public.blastapi.io',
    Consensys: 'https://explorer.goerli.zkevm.consensys.net/api/eth-rpc', //'https://consensys-zkevm-goerli-prealpha.infura.io/v3/',
}

export const explorerTx = {
    Ethereum: 'https://etherscan.io/tx/',
    BSC: 'https://bscscan.com/tx/',
    Polygon: 'https://polygonscan.com/tx/',
    Avalanche: 'https://snowtrace.io/tx/',
    Arbitrum: 'https://arbiscan.io/tx/',
    Optimism: 'https://optimistic.etherscan.io/tx',
    Fantom: 'https://ftmscan.com/tx/',
    Moonbeam: 'https://moonscan.io/tx/',
    Aptos: 'https://explorer.aptoslabs.com/txn/',
    Goerli: 'https://goerli.etherscan.io/tx/',
    Consensys: 'https://explorer.goerli.zkevm.consensys.net/tx/',
}

export const contract = {
    Ethereum: {
        leyer0ChainId: 101,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    BSC: {
        leyer0ChainId: 102,
        WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    },
    Polygon: {
        leyer0ChainId: 109,
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        StargateRouter: '0x45a01e4e04f14f7a4a6702c74187c5f6222033cd',
        AptosRouter: '0x488863d609f3a673875a914fbee7508a1de45ec6'
    },
    Avalanche: {
        leyer0ChainId: 106,
        WAVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        BTCB: '0x152b9d0fdc40c096757f570a51e494bd4b943e50',
        USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        STG: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
        veSTG: '0xCa0F57D295bbcE554DA2c07b005b7d6565a58fCE',
        traderJoe: '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3',
        BTCbRouter: '0x2297aebd383787a160dd0d9f71508148769342e3',
        StargateRouter: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
        AptosRouter: '0xa5972eee0c9b5bbb89a5b16d1d65f94c9ef25166'
    },
    Arbitrum: {
        leyer0ChainId: 110,
        WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
        BTCB: '0x2297aEbD383787A160DD0d9F71508148769342E3',
        BTCbRouter: '0x2297aebd383787a160dd0d9f71508148769342e3',
        UniswapV3: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
        ArbitrumWETHUSDCLP: '0x7eC3717f70894F6d9BA0be00774610394Ce006eE',
        StargateRouter: '0x53Bf833A5d6c4ddA888F69c22C88C9f356a41614',
    },
    Optimism: {
        leyer0ChainId: 111,
        WETH: '0x4200000000000000000000000000000000000006',
        USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        Galaxy: '0x2e42f214467f647fe687fd9a2bf3baddfa737465',
        FreeNFTOpt: '0x81b30ff521d1feb67ede32db726d95714eb00637',
        UniswapV3: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        QueryUniswap: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        PoolTogether: '0x79bc8bd53244bc8a9c8c27509a2d573650a83373',
        PoolTicketUSDC: '0x62BB4fc73094c83B5e952C2180B23fA7054954c4',
        Synapse: '0xf44938b0125a6662f9536281ad2cd6c499f22004',
        nUSDLP: '0x2c6d91accC5Aa38c84653F28A80AEC69325BDd12',
        Pika: '0xd5a8f233cbddb40368d55c3320644fb36e597002',
        PikaManager: '0x8add31bc901214a37f3bb676cb90ad62b24fd9a5',
        PikaOracle: '0xDb4174E1A4005a30f5A0924f43c8dfCB8cbD828A',
        PikaBTCUSD: '0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593',
        PerputalProtocol: '0xAD7b4C162707E0B2b5f6fdDbD3f8538A5fbA0d60',
        PerputalMargin: '0x82ac2CE43e33683c58BE4cDc40975E73aA50f459',
        PerputalPosition: '0xA7f3FC32043757039d5e13d790EE43edBcBa8b7c',
        PerputalVBTC: '0x86f1e0420c26a858fc203A3645dD1A36868F18e5',
    },
    Aptos: {
        leyer0ChainId: 108,
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