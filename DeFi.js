import Web3 from 'web3';
import { Account, Contract, ec, json, stark, Provider, hash, number, uint256 } from 'starknet';
import { chainContract } from './other.js';

//STARGATE
export const dataStakeSTG = async(rpc, amount, unlockTime, addressFrom) => {
    const w3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const contract = new w3.eth.Contract(abiStargate, w3.utils.toChecksumAddress(chainContract.Avalanche.veSTG));

    const data = await contract.methods.create_lock(
        w3.utils.numberToHex(amount),
        unlockTime,
    );

    const encodeABI = data.encodeABI();
    const estimateGas = await data.estimateGas({ from: addressFrom });

    return { encodeABI, estimateGas };
}

//NOSTRA FINANCE STARKNET ETH
export const dataDepositNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.ETH,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.NostraiETH,
            amount: {type: 'struct', low: '4000000000000000', high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.NostraiETH,
        entrypoint: "mint",
        calldata: stark.compileCalldata({
            to: address,
            amount: {type: 'struct', low: '4000000000000000', high: '0'},
        })
    }];
}

export const dataBorrowNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.NostradETH,
        entrypoint: "mint",
        calldata: stark.compileCalldata({
            to: address,
            amount: {type: 'struct', low: '2880000000000000', high: '0'},
        })
    }];
}

export const dataRepayNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.ETH,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.NostradETH,
            amount: {type: 'struct', low: '2908800000000000', high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.NostradETH,
        entrypoint: "burn",
        calldata: stark.compileCalldata({
            burnFrom: address,
            amount: {type: 'struct', low: '0xffffffffffffffffffffffffffffffff', high: '0xffffffffffffffffffffffffffffffff'},
        })
    }];
}

export const dataWithdrawNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.NostraiETH,
        entrypoint: "burn",
        calldata: stark.compileCalldata({
            burnFrom: address,
            to: address,
            amount: {type: 'struct', low: '0xffffffffffffffffffffffffffffffff', high: '0xffffffffffffffffffffffffffffffff'},
        })
    }];
}

//NOSTRA FINANCE STARKNET USDC
export const dataDepositUSDCNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.USDC,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.NostraiUSDC,
            amount: {type: 'struct', low: '5000000', high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.NostraiUSDC,
        entrypoint: "mint",
        calldata: stark.compileCalldata({
            to: address,
            amount: {type: 'struct', low: '5000000', high: '0'},
        })
    }];
}

export const dataBorrowUSDCNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.NostradUSDC,
        entrypoint: "mint",
        calldata: stark.compileCalldata({
            to: address,
            amount: {type: 'struct', low: '4275000', high: '0'},
        })
    }];
}

export const dataRepayUSDCNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.USDC,
        entrypoint: "approve",
        calldata: stark.compileCalldata({
            spender: chainContract.Starknet.NostradUSDC,
            amount: {type: 'struct', low: '4317750', high: '0'},
        })
    },
    {
        contractAddress: chainContract.Starknet.NostradUSDC,
        entrypoint: "burn",
        calldata: stark.compileCalldata({
            burnFrom: address,
            amount: {type: 'struct', low: '0xffffffffffffffffffffffffffffffff', high: '0xffffffffffffffffffffffffffffffff'},
        })
    }];
}

export const dataWithdrawUSDCNostra = async(address) => {
    return [{
        contractAddress: chainContract.Starknet.NostraiUSDC,
        entrypoint: "burn",
        calldata: stark.compileCalldata({
            burnFrom: address,
            to: address,
            amount: {type: 'struct', low: '0xffffffffffffffffffffffffffffffff', high: '0xffffffffffffffffffffffffffffffff'},
        })
    }];
}