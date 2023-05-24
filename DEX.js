import Web3 from 'web3';
import { ethers } from 'ethers';
import { subtract, multiply, divide } from 'mathjs';
import { rpc, chainContract } from './other.js';
import { abiToken, abiTraderJoe, abiBtcBridge, abiBebop, abiMySwapStarknet} from './abi.js';
import { Account, Contract, ec, json, stark, Provider, hash, number, uint256, RpcProvider, SequencerProvider } from 'starknet';
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

export const dataSwapAvaxToToken = async(rpc, amount, tokenIn, tokenOut, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactAVAXForTokens(
        w3.utils.numberToHex(parseInt(multiply(await getAmountsOut(rpc, amount, tokenIn, tokenOut, null, chainContract.Avalanche.JoeOracle), '0.985'))),
        [0],
        [tokenIn, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: amount });
    return { encodeABI, estimateGas };
}

export const dataSwapTokenToAvax = async(rpc, amount, tokenIn, tokenOut, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactTokensForAVAX(
        w3.utils.numberToHex(amount),
        w3.utils.toBN(parseInt(multiply(await getAmountsOut(rpc, amount, tokenIn, tokenOut, null, chainContract.Avalanche.JoeOracle), '0.995'))),
        [0],
        [tokenIn, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, amount: null });
    return { encodeABI, estimateGas };
}

export const dataSwapTokenToToken = async(rpc, amount, tokenIn, tokenOut, tokenMid, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiTraderJoe, w3.utils.toChecksumAddress(router));

    const data = await contractSwap.methods.swapExactTokensForTokens(
        amount,
        w3.utils.toBN(parseInt(multiply(await getAmountsOut(rpc, amount, tokenIn, tokenOut, tokenMid, chainContract.Avalanche.JoeOracle), '0.985'))),
        [0, 0],
        [tokenIn, tokenMid, tokenOut],
        fromAddress,
        Date.now() + 5 * 60 * 1000
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, amount: null });
    return { encodeABI, estimateGas };
}

//MYSWAP STARKNET
export const getUSDCAmountStarknet = async(rpc, amountETH, slippage) => {
    const w3 = new Web3();
    const provider = new RpcProvider({ nodeUrl: rpc });

    const contract = new Contract(abiMySwapStarknet, chainContract.Starknet.MySwapRouter, provider);
    const pool = await contract.get_pool('0x01');
    const poolETH = w3.utils.hexToNumberString(uint256.bnToUint256(pool[0].token_a_reserves.low).low);
    const poolUSDC = w3.utils.hexToNumberString(uint256.bnToUint256(pool[0].token_b_reserves.low).low);
    const price = parseInt( multiply( parseInt( (poolUSDC / 10**6) / (poolETH / 10**18) * 10**6 ) * (amountETH / 10**18), slippage ) );

    return price;
}

export const getETHAmountStarknet = async(rpc, amountUSDC, slippage) => {
    const w3 = new Web3();
    const provider = new RpcProvider({ nodeUrl: rpc });

    const contract = new Contract(abiMySwapStarknet, chainContract.Starknet.MySwapRouter, provider);
    const pool = await contract.get_pool('0x01');
    const poolETH = w3.utils.hexToNumberString(uint256.bnToUint256(pool[0].token_a_reserves.low).low);
    const poolUSDC = w3.utils.hexToNumberString(uint256.bnToUint256(pool[0].token_b_reserves.low).low);
    const price = parseInt( multiply( parseInt( (poolETH / 10**18) / (poolUSDC / 10**6) * 10**18 ) * (amountUSDC / 10**6), slippage ) );

    return price;
}

export const dataSwapEthToUsdc = async(rpc, amountETH, slippage) => {
    const amountUSDC = await getUSDCAmountStarknet(rpc, amountETH, slippage);

    const payload = [{
        contractAddress: chainContract.Starknet.ETH,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.MySwapRouter,
            amount: {type: 'struct', low: amountETH.toString(), high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.MySwapRouter,
        entrypoint: "swap",
        calldata: stark.compileCalldata({
            pool_id: '0x01',
            token_from_addr: chainContract.Starknet.ETH,
            amount_from: {type: 'struct', low: amountETH.toString(), high: '0'},
            amount_to_min: {type: 'struct', low: amountUSDC.toString(), high: '0'},
        })
    }];

    return payload;
}

export const dataSwapUsdcToEth = async(rpc, amountUSDC, slippage) => {
    const amountETH = await getETHAmountStarknet(rpc, amountUSDC, slippage);

    const payload = [{
        contractAddress: chainContract.Starknet.USDC,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.MySwapRouter,
            amount: {type: 'struct', low: amountUSDC.toString(), high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.MySwapRouter,
        entrypoint: "swap",
        calldata: stark.compileCalldata({
            pool_id: '0x01',
            token_from_addr: chainContract.Starknet.USDC,
            amount_from: {type: 'struct', low: amountUSDC.toString(), high: '0'},
            amount_to_min: {type: 'struct', low: amountETH.toString(), high: '0'},
        })
    }];

    return payload;
}

export const dataAddLiquidity = async(rpc, amountUSDC, slippage) => {
    const amountETH = await getETHAmountStarknet(rpc, amountUSDC, 1);
    const minAmountETH = parseInt( multiply(amountETH, slippage) );
    const minAmountUSDC = parseInt( multiply(amountUSDC, slippage) );

    const payload = [{
        contractAddress: chainContract.Starknet.ETH,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.MySwapRouter,
            amount: {type: 'struct', low: amountETH.toString(), high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.USDC,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.MySwapRouter,
            amount: {type: 'struct', low: amountUSDC.toString(), high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.MySwapRouter,
        entrypoint: "add_liquidity",
        calldata: stark.compileCalldata({
            a_address: chainContract.Starknet.ETH,
            a_amount: {type: 'struct', low: amountETH.toString(), high: '0'},
            a_min_amount: {type: 'struct', low: minAmountETH.toString(), high: '0'},
            b_address: chainContract.Starknet.USDC,
            b_amount: {type: 'struct', low: amountUSDC.toString(), high: '0'},
            b_min_amount: {type: 'struct', low: minAmountUSDC.toString(), high: '0'},
        })
    }];

    return payload;
}

export const getValueTokensLPMySwap = async(rpc, amountLP, slippage) => {
    const w3 = new Web3();
    const provider = new RpcProvider({ nodeUrl: rpc });

    const contract = new Contract(abiMySwapStarknet, chainContract.Starknet.MySwapRouter, provider);
    let totalLP = (await contract.get_total_shares('0x01')).total_shares;
    totalLP = w3.utils.hexToNumberString(uint256.bnToUint256(totalLP.low).low);

    const pool = (await contract.get_pool('0x01')).pool;
    const totalPool = multiply( w3.utils.hexToNumberString(uint256.bnToUint256(pool.token_b_reserves.low).low), 2);
    let amountUSDC = parseInt( divide( multiply( divide(totalPool, totalLP), amountLP), 2 ) );

    const amountETH = await getETHAmountStarknet(rpc, amountUSDC, slippage);
    amountUSDC = parseInt( multiply(amountUSDC, slippage) );

    return { amountETH, amountUSDC };
}

export const dataDeleteLiquidity = async(amountLP, slippage) => {
    const valueLP = await getValueTokensLPMySwap(amountLP, slippage);

    const payload = [{
        contractAddress: chainContract.Starknet.ETHUSDCLP,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.MySwapRouter,
            amount: {type: 'struct', low: amountLP.toString(), high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.MySwapRouter,
        entrypoint: "withdraw_liquidity",
        calldata: stark.compileCalldata({
            pool_id: '0x01',
            shares_amount: {type: 'struct', low: amountLP.toString(), high: '0'},
            amount_min_a: {type: 'struct', low: valueLP.amountETH.toString(), high: '0'},
            amount_min_b: {type: 'struct', low: valueLP.amountUSDC.toString(), high: '0'},
        })
    }];

    return payload;
}