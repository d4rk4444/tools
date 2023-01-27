import Web3 from 'web3';
import { ethers } from 'ethers';
import { AptosClient, AptosAccount, CoinClient } from "aptos";
import { subtract, multiply, divide } from 'mathjs';
import { Account, Contract, ec, json, stark, Provider, hash, number, uint256 } from 'starknet';
import { abiToken, abiTraderJoe, abiBtcBridge, abiBebop, abiStargate, abiAptosBridge, abiStarknetBridge } from './abi.js';
import { getNonceAptos, privateToAddress, sendTransactionAptos, toWei } from './web3.js';
import { rpc, chainContract, explorerTx } from './other.js';
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

export const dataWithdrawFromBridge = async(amount, toAddress) => {
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
export async function lzAdapterParamsToBytes(version, gasAmount, nativeForDst, addressOnDst) {
    const w3 = new Web3();
    const adapterParamsBytes = ethers.utils.solidityPack(['uint16','uint256','uint256','address'],
    [version, gasAmount, w3.utils.toHex(Number(nativeForDst)), addressOnDst]);

    return adapterParamsBytes;
}

export async function feeBridgeBtc(rpc, toChainId, routerAddress, versionLZ, gasAmountLZ, nativeForDstLZ, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(routerAddress));
    const wallet32bytes = ethers.utils.hexZeroPad(wallet, 32);

    const data = await bridge.methods.estimateSendAndCallFee(
        toChainId,
        wallet32bytes,
        '1',
        '0x',
        500000,
        false,
        await lzAdapterParamsToBytes(versionLZ, gasAmountLZ, w3.utils.toHex(nativeForDstLZ), wallet)
    ).call();

    return data.nativeFee;
}

export async function bridgeBtcFromAvalancheToArbitrum(rpc, amount, adapterParams, valueForTx, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const router = '0x2297aebd383787a160dd0d9f71508148769342e3';
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(router));
    const wallet32bytes = ethers.utils.hexZeroPad(wallet, 32);

    const data = await bridge.methods.sendFrom(
        wallet,
        110,
        wallet32bytes,
        amount,
        amount,
        [wallet, '0x0000000000000000000000000000000000000000', adapterParams]
    );

    const tx = {
        'from': wallet,
        'gas': 250000,
        'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
        'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': router,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': valueForTx,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Bridge BTC.b to Arbitrum: ${chainExplorerTx.Avalanche + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

export async function bridgeBtcFromArbitrumToAvalanche(rpc, amount, adapterParams, valueForTx, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const router = '0x2297aEbD383787A160DD0d9F71508148769342E3';
    const bridge = new w3.eth.Contract(abiBtcBridge, w3.utils.toChecksumAddress(router));
    const wallet32bytes = ethers.utils.hexZeroPad(wallet, 32);

    const data = await bridge.methods.sendFrom(
        wallet,
        106,
        wallet32bytes,
        amount,
        amount,
        [wallet, '0x0000000000000000000000000000000000000000', adapterParams]
    );

    const tx = {
        'from': wallet,
        'gas': 1200000,
        'baseFeePerGas': w3.utils.toWei('0.1', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': router,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': valueForTx,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Bridge BTC.b to Avalanche-C: ${chainExplorerTx.Arbitrum + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

export async function feeBridgeStargate(rpc, toChainId, routerAddress, gasAmountLZ, nativeForDstLZ, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(routerAddress));

    const data = await bridge.methods.quoteLayerZeroFee(
        toChainId,
        1,
        wallet,
        '0x',
        [gasAmountLZ, w3.utils.toHex(nativeForDstLZ), wallet]
    ).call();

    return data.nativeFee;
}

export async function bridgeUSDCFromAvalancheToPolygonStargate(rpc, amountMwei, gasAmountLZ, nativeForDstLZ, valueForTx, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const router = '0x45a01e4e04f14f7a4a6702c74187c5f6222033cd';
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.swap(
        109,
        1,
        1,
        wallet,
        amountMwei,
        w3.utils.toBN(parseInt(multiply(amountMwei, 0.995))),
        [gasAmountLZ, nativeForDstLZ, wallet],
        wallet,
        '0x'
    );

    const tx = {
        'from': wallet,
        'gas': 750000,
        'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
        'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': router,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': valueForTx,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Bridge USDC to Polygon: ${chainExplorerTx.Avalanche + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

export async function bridgeUSDCFromPolygonToAvalancheStargate(rpc, amountMwei, gasAmountLZ, nativeForDstLZ, valueForTx, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const router = '0x45a01e4e04f14f7a4a6702c74187c5f6222033cd';
    const bridge = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.swap(
        106,
        1,
        1,
        wallet,
        amountMwei,
        w3.utils.toBN(parseInt(multiply(amountMwei, 0.99))),
        [gasAmountLZ, nativeForDstLZ, wallet],
        wallet,
        '0x'
    );

    const tx = {
        'from': wallet,
        'gas': 500000,
        'maxFeePerGas': w3.utils.toWei('150', 'gwei'),
        'maxPriorityFeePerGas': w3.utils.toWei('30', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': router,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': valueForTx,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Bridge USDC to Avalanche: ${chainExplorerTx.Polygon + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

export async function feeBridgeToAptos(rpc, routerAddress, versionLZ, gasAmountLZ, nativeForDstLZ, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const bridge = new w3.eth.Contract(abiAptosBridge, w3.utils.toChecksumAddress(routerAddress));

    const data = await bridge.methods.quoteForSend(
        [wallet, '0x0000000000000000000000000000000000000000'],
        await lzAdapterParamsToBytes(versionLZ, gasAmountLZ, w3.utils.toHex(nativeForDstLZ), wallet)
    ).call();

    return data.nativeFee;
}

export async function bridgeUSDCFromAvalancheToAptos(rpc, amountMwei, toAddress, adapterParams, valueForTx, privateKey) {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    
    const wallet = w3.eth.accounts.privateKeyToAccount(privateKey).address;
    const router = chainContract.Avalanche.AptosRouter;
    const bridge = new w3.eth.Contract(abiAptosBridge, w3.utils.toChecksumAddress(router));

    const data = await bridge.methods.sendToAptos(
        chainContract.Avalanche.USDC,
        toAddress,
        amountMwei,
        [wallet, '0x0000000000000000000000000000000000000000'],
        adapterParams
    );

    const tx = {
        'from': wallet,
        'gas': 350000,
        'baseFeePerGas': w3.utils.toWei('35', 'gwei'),
        'maxPriorityFeePerGas': w3.utils.toWei('1.5', 'gwei'),
        'chainId': w3.eth.getChainId(),
        'to': router,
        'nonce': await w3.eth.getTransactionCount(wallet),
        'value': valueForTx,
        'data': data.encodeABI()
    };
    
    const signedTx = await w3.eth.accounts.signTransaction(tx, privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async function(error, hash) {
        if (!error) {
            console.log(`Bridge USDC from Avalanche to Aptos: ${chainExplorerTx.Avalanche + hash}`);
        } else {
            console.log(`Error Tx: ${error}`);
        }
    });
}

export async function bridgeUSDCFromAptosToAvalanche(amountMwei, toAddress, privateKey) {
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

export async function claimUSDCAptos(privateKey) {
    return await sendTransactionAptos({
        "function": "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::coin_bridge::claim_coin",
        "type_arguments": [
          "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC"
        ],
        "arguments": [],
        "type": "entry_function_payload"
    }, await getNonceAptos(privateKey), 2200, privateKey);
}

//CONSENSYS
export async function bridgeETHFromGoerliToConsensys(rpc, privateKey) {
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