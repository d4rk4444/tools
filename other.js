import Web3 from 'web3';
import { privateToAptosAddress } from './web3.js';
import fs from 'fs';
import chalk from 'chalk';


export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const generateRandomAmount = (min, max, num) => {
    const amount = Number(Math.random() * (parseFloat(max) - parseFloat(min)) + parseFloat(min));
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
    Starknet: 'https://voyager.online/tx/',
    Goerli: 'https://goerli.etherscan.io/tx/',
    Consensys: 'https://explorer.goerli.zkevm.consensys.net/tx/',
}

export const chainContract = {
    Ethereum: {
        leyer0ChainId: 101,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        StarknetBridge: '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419',
    },
    BSC: {
        leyer0ChainId: 102,
        USDTID: 2,
        WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        BUSD: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
        StargateRouter: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
    },
    Polygon: {
        leyer0ChainId: 109,
        USDCID: 1,
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        StargateRouter: '0x45a01e4e04f14f7a4a6702c74187c5f6222033cd',
        AptosRouter: '0x488863d609f3a673875a914fbee7508a1de45ec6'
    },
    Avalanche: {
        leyer0ChainId: 106,
        USDCID: 1,
        WAVAX: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        BTCB: '0x152b9d0fdc40c096757f570a51e494bd4b943e50',
        USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
        STG: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
        veSTG: '0xCa0F57D295bbcE554DA2c07b005b7d6565a58fCE',
        TraderJoe: '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3',
        JoeOracle: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
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
    Starknet: {
        ETH: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        ETHAbi: '0x48624e084dc68d82076582219c7ed8cb0910c01746cca3cd72a28ecfe07e42d',
        USDC: '0x053C91253BC9682c04929cA02ED00b3E423f6710D2ee7e0D5EBB06F3eCF368A8',
        USDCAbi: '0x048624E084dc68D82076582219C7eD8Cb0910c01746cca3cd72a28eCFE07e42d',
        ETHUSDCLP: '0x022b05f9396d2c48183f6deaf138a57522bcc8b35b67dee919f76403d1783136',
        MySwapRouter: '0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28',
        StarknetId: '0x05dbdedc203e92749e2e746e2d40a768d966bd243df04a6b712e222bc040a9af',
        NostraiETH: '0x070f8a4fcd75190661ca09a7300b7c93fab93971b67ea712c664d7948a8a54c6',
        NostradETH: '0x040b091cb020d91f4a4b34396946b4d4e2a450dbd9410432ebdbfe10e55ee5e5',
        StargateBridge: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
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