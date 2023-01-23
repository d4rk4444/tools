import Web3 from 'web3';

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