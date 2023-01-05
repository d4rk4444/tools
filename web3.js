import Web3 from 'web3';
import { AptosClient, AptosAccount, CoinClient } from "aptos";
import { ethers } from 'ethers';
import { timeout, generateRandomAmount, chainRpc, chainContract, chainExplorerTx } from './other.js'
import { abiToken } from './abi.js';
import { getETHAmount } from './DEX.js';
import { subtract, multiply, divide } from 'mathjs';
import * as dotenv from 'dotenv';
dotenv.config()


export function privateToAddress(privateKey) {
    const w3 = new Web3();
    return w3.eth.accounts.privateKeyToAccount(privateKey).address;
}
export function privateToAptosAddress(privateKey) {
    const mainAccount = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    return mainAccount.accountAddress.hexString;
}
export function toWei(amount, type) {
    const w3 = new Web3();
    return w3.utils.toWei(amount, type);
}
export function fromWei(amount, type) {
    const w3 = new Web3();
    return w3.utils.fromWei(amount, type);
}
export function toHex(amount) {
    const w3 = new Web3();
    return w3.utils.toHex(amount);
}
export async function sendAllAvax(rpc, toAddress, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        let amount = await getETHAmount(rpc, wallet);
        if (amount == 0) {
            console.log(`Balance 0 AVAX`);
            return;
        }
        amount = subtract(subtract(amount, generateRandomAmount(50, 150, 0)), multiply(21000, w3.utils.toWei('51.5', 'gwei')));

        const tx = {
            'from': wallet,
            'gas': 21000,
            'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': amount,
            'data': null
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Send AVAX: ${chainExplorerTx.Avalanche + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}
export async function sendAllETH(rpc, toAddress, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        let amount = await getETHAmount(rpc, wallet);
        if (amount == 0) {
            console.log(`Balance 0 ETH`);
            return;
        }
        const gasLimit = generateRandomAmount(340000, 390000, 0);
        amount = subtract(subtract(amount, generateRandomAmount(50, 150, 0)), multiply(gasLimit, w3.utils.toWei('0.1', 'gwei')));

        const tx = {
            'from': wallet,
            'gas': gasLimit,
            'baseFeePerGas': w3.utils.toWei('0.1', 'gwei'),
            //'maxPriorityFeePerGas': w3.utils.toWei('0.1', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': amount,
            'data': null
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Send ETH: ${chainExplorerTx.Arbitrum + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}
export async function sendAllMatic(rpc, toAddress, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        let amount = await getETHAmount(rpc, wallet);
        if (amount == 0) {
            console.log(`Balance 0 MATIC`);
            return;
        }
        amount = subtract(subtract(amount, generateRandomAmount(50, 150, 0)), multiply(21000, w3.utils.toWei('1000', 'gwei')));

        const tx = {
            'from': wallet,
            'gas': 21000,
            'gasPrice': w3.utils.toWei('1000', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': amount,
            'data': null
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Send MATIC: ${chainExplorerTx.Polygon + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}
export async function sendTokenFromAvalanche(rpc, tokenAddress, amount, toAddress, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.transfer(
        toAddress,
        amount
    );

    const tx = {
        'from': wallet,
        'gas': 333000,
        'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
        'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': tokenAddress,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': null,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Send Token: ${chainExplorerTx.Avalanche + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

//APTOS
export async function getNonceAptos(privateKey) {
    const client = new AptosClient(chainRpc.Aptos);
    const acc = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    const nonce = (await client.getAccount(acc.address())).sequence_number;
    return nonce;
}
export async function sendTransactionAptos(payload, nonce, gasLimit, privateKey) {
    const client = new AptosClient(chainRpc.Aptos);
    const sender = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    
    try {
        const txnRequest = await client.generateTransaction(sender.address(), payload, {
            gas_unit_price: 100,
            max_gas_amount: gasLimit,
            sequence_number: nonce
        });

        const signedTxn = await client.signTransaction(sender, txnRequest);
        const transactionRes = await client.submitTransaction(signedTxn);

        await client.waitForTransactionWithResult(transactionRes.hash, { checkSuccess: true }).then(async function(hash) {
            console.log(`Send TX in Aptos: ${chainExplorerTx.Aptos + hash.hash}`)
        });
    } catch (err) {
        try {
            console.log('[ERROR]', JSON.parse(err?.message).message)
        } catch { console.log('[ERROR]', err.message) }
        await timeout(2000)
    }
}
export async function getBalanceAptos(privateKey) {
    const client = new AptosClient(chainRpc.Aptos);
    const coinClient = new CoinClient(client);
    const account = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    try {
        let balance = Number(await coinClient.checkBalance(account));
        return balance;
    } catch (err) {
        try {
            console.log('[ERROR]', JSON.parse(err?.message).message)
        } catch {
            console.log('[ERROR]', err.message)
        }
        await timeout(2000)
    }
    return -1;
}
export async function getBalanceUSDCAptos(privateKey) {
    const client = new AptosClient(chainRpc.Aptos);
    const coinClient = new CoinClient(client);
    const account = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    try {
        let balance = Number(await coinClient.checkBalance(account, {
            coinType: '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'
        }));
        return balance;
    } catch (err) {
        try {
            console.log('[ERROR]', JSON.parse(err?.message).message)
        } catch {
            console.log('[ERROR]', err.message)
        }
        await timeout(2000)
    }
}