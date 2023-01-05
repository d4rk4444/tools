import Web3 from 'web3';
import { ethers } from 'ethers';
import { subtract, multiply, divide } from 'mathjs';
import { abiToken, abiTraderJoe, abiBtcBridge, abiBebop } from './abi.js';
import { chainContract, chainExplorerTx, chainRpc } from './other.js';
import * as dotenv from 'dotenv';
dotenv.config()


export async function getAmountToken(rpc, tokenAddress, walletAddress) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.balanceOf(
        walletAddress
    ).call();

    return data;
}

export async function getETHAmount(rpc, walletAddress) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const data = await w3.eth.getBalance(walletAddress);
    return data;
}

export async function amountOut(rpc, amount, tokenIn, tokenOut, tokenMid) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress('0x60aE616a2155Ee3d9A68541Ba4544862310933d4'));

    if (!tokenMid) {
        const data = await contractSwap.methods.getAmountsOut(
            amount,
            [tokenIn, tokenOut]
        ).call()
        return data[1];
    } else if (tokenMid) {
        const data = await contractSwap.methods.getAmountsOut(
            amount,
            [tokenIn, tokenMid, tokenOut]
        ).call()
        return data[2];
    }
}

export async function swapAvaxToToken(rpc, amount, tokenIn, tokenOut, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        const router = '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3';
        const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

        const data = await contractSwap.methods.swapExactAVAXForTokens(
            w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut), '0.985'))),
            [0],
            [tokenIn, tokenOut],
            wallet,
            Date.now() + 5 * 60 * 1000
        )

        const tx = {
            'from': wallet,
            'gas': 200000,
            'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': router,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': amount,
            'data': data.encodeABI()
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Swap Tokens: ${chainExplorerTx.Avalanche + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}

export async function swapTokenToAvax(rpc, amount, tokenIn, tokenOut, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        const router = '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3';
        const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

        const data = await contractSwap.methods.swapExactTokensForAVAX(
            amount,
            w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut), '0.985'))),
            [0],
            [tokenIn, tokenOut],
            wallet,
            Date.now() + 5 * 60 * 1000
        )

        const tx = {
            'from': wallet,
            'gas': 200000,
            'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': router,
            'nonce': await w3.eth.getTransactionCount(wallet),
            //'value': amount,
            'data': data.encodeABI()
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Swap Tokens: ${chainExplorerTx.Avalanche + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}

export async function swapTokenToToken(rpc, amount, tokenIn, tokenOut, tokenMid, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        const router = '0xe3ffc583dc176575eea7fd9df2a7c65f7e23f4c3';
        const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

        const data = await contractSwap.methods.swapExactTokensForTokens(
            amount,
            w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut, tokenMid), '0.985'))),
            [0, 0],
            [tokenIn, tokenMid, tokenOut],
            wallet,
            Date.now() + 5 * 60 * 1000
        )

        const tx = {
            'from': wallet,
            'gas': 220000,
            'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': router,
            'nonce': await w3.eth.getTransactionCount(wallet),
            //'value': amount,
            'data': data.encodeABI()
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Swap Tokens: ${chainExplorerTx.Avalanche + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}

export async function approveTokenAvalanche(rpc, amount, tokenAddress, contractAddress, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contractToken = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

        const data = await contractToken.methods.approve(
            contractAddress,
            amount,
        );

        const tx = {
            'from': wallet,
            'gas': 100000,
            'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': tokenAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'data': data.encodeABI()
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Approve Token: ${chainExplorerTx.Avalanche + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}

export async function approveTokenPolygon(rpc, amount, tokenAddress, contractAddress, privateKey) {
    try {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
        const contractToken = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

        const data = await contractToken.methods.approve(
            contractAddress,
            amount,
        );

        const tx = {
            'from': wallet,
            'gas': 75000,
            'baseFeePerGas': w3.utils.toWei('150', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('30', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': tokenAddress,
            'nonce': await w3.eth.getTransactionCount(wallet),
            'data': data.encodeABI()
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Approve Token: ${chainExplorerTx.Polygon + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
    } catch (err) {
        console.log(`Function Error: ${err}`);
    }
}

export async function checkAllowance(rpc, tokenAddress, owner, spender) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const token = new w3.eth.Contract(abiToken, w3.utils.toChecksumAddress(tokenAddress));

    const data = await token.methods.allowance(
        owner,
        spender
    ).call();

    return data;
}