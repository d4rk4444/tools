import Web3 from 'web3';
import { ethers } from 'ethers';
import { subtract, multiply, divide } from 'mathjs';
import { Account, Contract, ec, json, stark, Provider, hash, number, uint256 } from 'starknet';
import { abiToken, abiTraderJoe, abiBtcBridge, abiBebop, abiStargate, abiAptosBridge, abiStarknetBridge } from './abi.js';
import { getNonceAptos, privateToAddress, sendTransactionAptos, toWei } from './web3.js';
import { chainContract } from './other.js';
import * as dotenv from 'dotenv';
dotenv.config()

//STARKNET
export const dataBridgeETHToStarknet = async(rpc, toStarknetAddress, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiStarknetBridge, w3.utils.toChecksumAddress(chainContract.Ethereum.StarknetBridge));

    const data = await contractSwap.methods.deposit(
        w3.utils.hexToNumberString(toStarknetAddress)
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress });
    return { encodeABI, estimateGas };
}

export const dataBridgeETHFromStarknet = async(toAddress, amount) => {
    return [{
        contractAddress: chainContract.Starknet.StargateBridge,
        entrypoint: "initiate_withdraw",
        calldata: stark.compileCalldata({
            l1_recipient: toAddress,
            amount: {type: 'struct', low: amount.toString(), high: '0'}
        })
    }];
}

export const dataWithdrawFromBridge = async(rpc, amount, toAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contractSwap = new w3.eth.Contract(abiStarknetBridge, w3.utils.toChecksumAddress(chainContract.Ethereum.StarknetBridge));

    const data = await contractSwap.methods.withdraw(
        amount,
        toAddress
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: toAddress });
    return { encodeABI, estimateGas };
}

//LEYERZERO
export const lzAdapterParamsToBytes = async(version, gasAmount, nativeForDst, addressOnDst) => {
    const w3 = new Web3();
    const adapterParamsBytes = ethers.utils.solidityPack(
        ['uint16','uint256','uint256','address'],
        [version, gasAmount, w3.utils.numberToHex(nativeForDst), addressOnDst]
    );

    return adapterParamsBytes;
}

export const feeBridgeBTC = async(rpc, toChainId, routerAddress, versionLZ, gasAmountLZ, nativeForDstLZ, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(routerAddress));
    const wallet32bytes = ethers.utils.hexZeroPad(fromAddress, 32);

    const data = await bridge.methods.estimateSendAndCallFee(
        toChainId,
        wallet32bytes,
        '1',
        '0x',
        500000,
        false,
        await lzAdapterParamsToBytes(versionLZ, gasAmountLZ, w3.utils.numberToHex(nativeForDstLZ), fromAddress)
    ).call();

    return data.nativeFee;
}

export const dataBridgeBTCAvaxToArbitrum = async(rpc, amount, adapterParams, valueTx, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const router = '0x2297aebd383787a160dd0d9f71508148769342e3';
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(router));
    const wallet32bytes = ethers.utils.hexZeroPad(fromAddress, 32);

    const data = await bridge.methods.sendFrom(
        fromAddress,
        110,
        wallet32bytes,
        amount,
        amount,
        [fromAddress, '0x0000000000000000000000000000000000000000', adapterParams]
    );
    
    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: valueTx });
    return { encodeABI, estimateGas };
}

export const dataBridgeBTCArbitrumToAvax = async(rpc, amount, adapterParams, valueTx, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const router = '0x2297aEbD383787A160DD0d9F71508148769342E3';
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(router));
    const wallet32bytes = ethers.utils.hexZeroPad(fromAddress, 32);

    const data = await bridge.methods.sendFrom(
        fromAddress,
        106,
        wallet32bytes,
        amount,
        amount,
        [fromAddress, '0x0000000000000000000000000000000000000000', adapterParams]
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: valueTx });
    return { encodeABI, estimateGas };
}

export const feeBridgeStargate = async(rpc, toChainId, routerAddress, gasAmountLZ, nativeForDstLZ, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(routerAddress));

    const data = await bridge.methods.quoteLayerZeroFee(
        toChainId,
        1,
        fromAddress,
        '0x',
        [gasAmountLZ, w3.utils.numberToHex(nativeForDstLZ), fromAddress]
    ).call();

    return data.nativeFee;
}

export const dataStargateBridgeAvaxToOther = async(rpc, toChainId, srcPoolId, dstPoolId, amountMwei, gasAmountLZ, nativeForDstLZ, valueTx, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.swap(
        toChainId,
        srcPoolId,
        dstPoolId,
        fromAddress,
        amountMwei,
        w3.utils.numberToHex(parseInt(multiply(amountMwei, 0.995))),
        [gasAmountLZ, w3.utils.numberToHex(nativeForDstLZ), fromAddress],
        fromAddress,
        '0x'
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: valueTx });
    return { encodeABI, estimateGas };
}

export const dataStargateBridgeOtherToAvax = async(rpc, srcPoolId, dstPoolId, amountMwei, gasAmountLZ, nativeForDstLZ, valueTx, router, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.swap(
        chainContract.Avalanche.leyer0ChainId,
        srcPoolId,
        dstPoolId,
        fromAddress,
        amountMwei,
        w3.utils.toBN(parseInt(multiply(amountMwei, 0.99))),
        [gasAmountLZ, w3.utils.numberToHex(nativeForDstLZ), fromAddress],
        fromAddress,
        '0x'
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: valueTx });
    return { encodeABI, estimateGas };
}

export const feeBridgeAptos = async(rpc, routerAddress, versionLZ, gasAmountLZ, nativeForDstLZ, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const bridge = new w3.eth.Contract(abiAptosBridge, w3.utils.toChecksumAddress(routerAddress));
    const data = await bridge.methods.quoteForSend(
        [fromAddress, '0x0000000000000000000000000000000000000000'],
        await lzAdapterParamsToBytes(versionLZ, gasAmountLZ, w3.utils.toHex(nativeForDstLZ), fromAddress)
    ).call();

    return data.nativeFee;
}

export const dataBridgeUSDCAvaxToAptos = async(rpc, amountMwei, toAddress, adapterParams, valueTx, fromAddress) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const router = chainContract.Avalanche.AptosRouter;
    const bridge = new w3.eth.Contract(abiAptosBridge, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.sendToAptos(
        chainContract.Avalanche.USDC,
        toAddress,
        amountMwei,
        [fromAddress, '0x0000000000000000000000000000000000000000'],
        adapterParams
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: fromAddress, value: valueTx });
    return { encodeABI, estimateGas };
}

export const claimUSDCAptos = async(privateKey) => {
    return await sendTransactionAptos({
        "function": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::coin_bridge::claim_coin",
        "type_arguments": [
          "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC"
        ],
        "arguments": [],
        "type": "entry_function_payload"
    }, await getNonceAptos(privateKey), 2200, privateKey);
}

export const bridgeUSDCAptosToAvax = async(amountMwei, toAddress, privateKey) => {
    const w3 = new Web3();
    return await sendTransactionAptos({
        "function": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::coin_bridge::send_coin_from",
        "type_arguments": [
          "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC"
        ],
        "arguments": [
          "106",
          Buffer.from(w3.utils.hexToBytes(ethers.utils.hexZeroPad(toAddress, 32))),
          amountMwei,
          "8000000",
          "0",
          false,
          Buffer.from(w3.utils.hexToBytes('0x000100000000000249f0')),
          Buffer.from('0x', 'hex')
        ],
        "type": "entry_function_payload"
    }, await getNonceAptos(privateKey), 12000, privateKey);
}

//CONSENSYS
export const bridgeETHFromGoerliToConsensys = async(rpc, privateKey) => {
        const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
        const wallet = privateToAddress(privateKey);

        const tx = {
            'from': wallet,
            'gas': 65000,
            'baseFeePerGas': w3.utils.toWei('80', 'gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
            'chainId': w3.eth.getChainId(),
            'to': '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40',
            'nonce': await w3.eth.getTransactionCount(wallet),
            'value': toWei('0.017', 'ether'),
            'data': `0x220b5b82000000000000000000000000${wallet.slice(2)}000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000063e5074300000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000`
        };
        
        const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
        await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
            if (!error) {
                console.log(`Bridge ETH to ConsenSys zkEVM: ${chainExplorerTx.Goerli + hash}`);
            } else {
                console.log(`Error Tx: ${error}`);
            }
        });
}