import Web3 from 'web3';
import { AptosClient, AptosAccount, CoinClient } from "aptos";
import ethers from 'ethers';
import { timeout, generateRandomAmount, rpc, contract, explorerTx } from './other.js';
import { abiStargate, abiToken } from './abi.js';
import { getETHAmount } from './DEX.js';
import { subtract, multiply, divide } from 'mathjs';
import * as dotenv from 'dotenv';
dotenv.config()

//UTILS
export const privateToAddress = (privateKey) => {
    const w3 = new Web3();
    return w3.eth.accounts.privateKeyToAccount(privateKey).address;
}

export const privateToAptosAddress = (privateKey) => {
    const mainAccount = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    return mainAccount.accountAddress.hexString;
}

export const toWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.toWei(w3.utils.numberToHex(amount), type);
}

export const fromWei = (amount, type) => {
    const w3 = new Web3();
    return w3.utils.fromWei(w3.utils.numberToHex(amount), type);
}

export const numberToHex = (amount) => {
    const w3 = new Web3();
    return w3.utils.numberToHex(amount);
}

//TX
export const getETHAmount = async(rpc, walletAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const data = await w3.eth.getBalance(walletAddress);
    return data;
}

export const getAmountToken = async(rpc, tokenAddress, walletAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.balanceOf(
        walletAddress
    ).call();

    return data;
}

export const checkAllowance = async(rpc, tokenAddress, walletAddress, spender) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.allowance(
        walletAddress,
        spender
    ).call();

    return data;
}

export const dataApprove = async(rpc, tokenAddress, contractAddress, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await contract.methods.approve(
        contractAddress,
        chainContract.approveAmount,
    );
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });

    return { encodeABI, estimateGas };
}

export const dataSendToken = async (rpc, tokenAddress, toAddress, amount, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await contract.methods.transfer(
        toAddress,
        amount
    );
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });

    return { encodeABI, estimateGas };
}

export const sendTX = async(rpc, typeTx, gasLimit, gasPrice, maxFee, maxPriorityFee, toAddress, value, data, privateKey) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const fromAddress = privateToAddress(privateKey);
    
    const tx = {
        0: {
            'from': fromAddress,
            'gas': gasLimit,
            'gasPrice': gasPrice,
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': value,
            'data': data
        },
        2: {
            'from': fromAddress,
            'gas': gasLimit,
            'maxFeePerGas': maxFee,
            'maxPriorityFeePerGas': maxPriorityFee,
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': value,
            'data': data
        }
    };

    const signedTx = await w3.eth.accounts.signTransaction(tx[typeTx], privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async(error, hash) => {
        if (!error) {
            const chain = Object.keys(rpc)[Object.values(rpc).findIndex(e => e == rpc)];
            console.log(`${chain} TX: ${chainExplorerTx[chain] + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

//APTOS
export const getNonceAptos = async(privateKey) => {
    const client = new AptosClient(chainRpc.Aptos);
    const acc = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    const nonce = (await client.getAccount(acc.address())).sequence_number;
    return nonce;
}

export const sendTransactionAptos = async(payload, nonce, gasLimit, privateKey) => {
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

export const getBalanceAptos = async(privateKey) => {
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

export const getBalanceUSDCAptos = async(privateKey) => {
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