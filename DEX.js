import Web3 from 'web3';
import { ethers } from 'ethers';
import { subtract, multiply, divide } from 'mathjs';
import { abiToken, abiTraderJoe, abiBtcBridge, abiBebop } from './abi.js';
import * as dotenv from 'dotenv';
dotenv.config()

//TRADERJOE
export const getAmountsOut = async(rpc, amount, tokenIn, tokenOut, tokenMid, router) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, router);

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

export const swapAvaxToToken = async(rpc, amount, tokenIn, tokenOut, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactAVAXForTokens(
        w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut), '0.985'))),
        [0],
        [tokenIn, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });
    return { encodeABI, estimateGas };
}

export const swapTokenToAvax = async(rpc, amount, tokenIn, tokenOut, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactTokensForAVAX(
        w3.utils.numberToHex(amount),
        w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut), '0.995'))),
        [0],
        [tokenIn, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });
    return { encodeABI, estimateGas };
}

export const swapTokenToToken = async(rpc, amount, tokenIn, tokenOut, tokenMid, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactTokensForTokens(
        amount,
        w3.utils.toBN(parseInt(multiply(await amountOut(rpc, amount, tokenIn, tokenOut, tokenMid), '0.985'))),
        [0, 0],
        [tokenIn, tokenMid, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });
    return { encodeABI, estimateGas };
}