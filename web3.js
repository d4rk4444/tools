import Web3 from 'web3';
import { AptosClient, AptosAccount, CoinClient } from "aptos";
import ethers from 'ethers';
import { timeout, generateRandomAmount, rpc, chainContract, explorerTx } from './other.js';
import { abiStargate, abiToken, abiStarknetId } from './abi.js';
import { subtract, multiply, divide, composition } from 'mathjs';
import { Account, Contract, ec, json, stark, Provider, hash, number, uint256 } from 'starknet';
import axios from 'axios';

//UTILS
export const privateToAddress = (privateKey) => {
    const w3 = new Web3();
    return w3.eth.accounts.privateKeyToAccount(privateKey).address;
}

export const privateToAptosAddress = (privateKey) => {
    const mainAccount = new AptosAccount(Uint8Array.from(Buffer.from(privateKey, 'hex')));
    return mainAccount.accountAddress.hexString;
}

export const privateToStarknetAddress = async(privateKey) => {
    //new Argent X account v0.2.3 :
    const argentXproxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
    const argentXaccountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

    const starkKeyPairAX = ec.getKeyPair(privateKey);
    const starkKeyPubAX = ec.getStarkKey(starkKeyPairAX);

    // Calculate future address of the ArgentX account
    const AXproxyConstructorCallData = stark.compileCalldata({
        implementation: argentXaccountClassHash,
        selector: hash.getSelectorFromName("initialize"),
        calldata: stark.compileCalldata({ signer: starkKeyPubAX, guardian: "0" }),
    });

    let AXcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPubAX,
        argentXproxyClassHash,
        AXproxyConstructorCallData,
        0
    );
    AXcontractAddress = stark.makeAddress(AXcontractAddress);

    return AXcontractAddress;
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

export const getGasPriceEthereum = async() => {
        try {
            const res = await axios.get('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=FC2TA4DAG1XVSPM58GIPVW42V2YH7GGTK5');
            const maxFee = res.data.result.FastGasPrice;
            const maxPriorityFee = parseFloat(res.data.result.gasUsedRatio.split(',')[2]).toFixed(3);

            return { maxFee, maxPriorityFee };
        } catch (err) {};
}

export const sendEVMTX = async(rpcProvider, typeTx, gasLimit, gasPrice, maxFee, maxPriorityFee, toAddress, value, data, privateKey) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpcProvider));
    const fromAddress = privateToAddress(privateKey);
    
    const tx = {
        0: {
            'from': fromAddress,
            'gas': gasLimit,
            'gasPrice': gasPrice,
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        },
        2: {
            'from': fromAddress,
            'gas': gasLimit,
            'maxFeePerGas': w3.utils.toWei(maxFee, 'Gwei'),
            'maxPriorityFeePerGas': w3.utils.toWei(maxPriorityFee, 'Gwei'),
            'chainId': await w3.eth.getChainId(),
            'to': toAddress,
            'nonce': await w3.eth.getTransactionCount(fromAddress),
            'value': value,
            'data': data
        }
    };

    const signedTx = await w3.eth.accounts.signTransaction(tx[typeTx], privateKey);
    await w3.eth.sendSignedTransaction(signedTx.rawTransaction, async(error, hash) => {
        if (!error) {
            const chain = Object.keys(rpc)[Object.values(rpc).findIndex(e => e == rpcProvider)];
            console.log(`${chain} TX: ${explorerTx[chain] + hash}`);
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

//STARKNET
export const deployStarknetWallet = async(privateKeyStarknet) => {
    // connect provider
    const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });

    //new Argent X account v0.2.3 :
    const argentXproxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
    const argentXaccountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

    // Generate public and private key pair.
    const starkKeyPairAX = ec.getKeyPair(privateKeyStarknet);
    const starkKeyPubAX = ec.getStarkKey(starkKeyPairAX);

    // Calculate future address of the ArgentX account
    const AXproxyConstructorCallData = stark.compileCalldata({
        implementation: argentXaccountClassHash,
        selector: hash.getSelectorFromName("initialize"),
        calldata: stark.compileCalldata({ signer: starkKeyPubAX, guardian: "0" }),
    });
    const AXcontractAddress = hash.calculateContractAddressFromHash(
        starkKeyPubAX,
        argentXproxyClassHash,
        AXproxyConstructorCallData,
        0
    );

    const accountAX = new Account(provider, AXcontractAddress, starkKeyPairAX);

    const deployAccountPayload = {
        classHash: argentXproxyClassHash,
        constructorCalldata: AXproxyConstructorCallData,
        contractAddress: AXcontractAddress,
        addressSalt: starkKeyPubAX };

    const { transaction_hash: AXdAth, contract_address: AXcontractFinalAdress } = await accountAX.deployAccount(deployAccountPayload);
    console.log(`✅ ArgentX wallet deployed at: ${AXcontractFinalAdress}`);
    console.log(`Transaction Hash: ${explorerTx.Starknet + AXdAth}`);
}

export const sendTransactionStarknet = async(payload, privateKey) => {
    const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });
    const starkKeyPair = ec.getKeyPair(privateKey);
    const address = await privateToStarknetAddress(privateKey);
    const account = new Account(provider, address, starkKeyPair);

    try {
        const executeHash = await account.execute(payload);
        console.log(`Send TX: ${explorerTx.Starknet + executeHash.transaction_hash}`);
        const res = await provider.waitForTransaction(executeHash.transaction_hash);
        console.log(`Fee: ${parseFloat(number.hexToDecimalString(res.actual_fee) / 10**18).toFixed(6)}ETH`);
    } catch (err) {
        console.log(`Error Starknet TX: ${err}`);
    }
}

export const estimateInvokeMaxFee = async(payload, privateKey) => {
    const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });
    const starkKeyPair = ec.getKeyPair(privateKey);
    const address = await privateToStarknetAddress(privateKey);
    const account = new Account(provider, address, starkKeyPair);

    const res = await account.estimateInvokeFee(payload);
    return number.hexToDecimalString(uint256.bnToUint256(res.suggestedMaxFee).low);
}

export const getAmountTokenStark = async(walletAddress, tokenAddress, abiAddress) => {
    const w3 = new Web3();
    const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });

    if (!abiAddress) { abiAddress = tokenAddress };
    const { abi: abi } = await provider.getClassAt(abiAddress);
    if (abi === undefined) { throw new Error("no abi.") };
    const contract = new Contract(abi, tokenAddress, provider);
    const balance = await contract.balanceOf(walletAddress);

    return w3.utils.hexToNumberString(uint256.bnToUint256(balance[0].low).low);
}

export const getApprovedStarknetId = async(starknetId) => {
    const provider = new Provider({ sequencer: { network: 'mainnet-alpha' } });
    const contract = new Contract(abiStarknetId, chainContract.Starknet.StarknetId, provider);
    try {
        await contract.getApproved({type: 'struct', low: starknetId, high: '0'});
        return false;
    } catch (err) {
        return true;
    }
}

export const dataMintStarknetId = async(starknetId) => {
    return [{
        contractAddress: chainContract.Starknet.StarknetId,
        entrypoint: "mint",
        calldata: stark.compileCalldata({
            starknet_id: starknetId.toString()
        })
    }];
}