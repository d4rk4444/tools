import { InverseClient,
    LinearClient,
    SpotClientV3,
    AccountAssetClient } from 'bybit-api';
import * as dotenv from 'dotenv';
dotenv.config()

const client = new AccountAssetClient({
    key: process.env.API_KEY_BYBIT,
    secret: process.env.API_SECRET_BYBIT,
    testnet: false
});

export async function balanceBYBIT(coin) {
    let coinBalance = await client.getAssetInformation()
    coinBalance = coinBalance.result.spot.assets.find(el => el.coin == coin).free

    return coinBalance;
}

export async function withdrawalBYBIT(coin, chain, amount, address) {
    const txCEX = await client.submitWithdrawal({
        coin: coin,
        chain: chain,
        address: address,
        amount: amount,
        //timestamp: new Date(Date.now())
    });

    if (txCEX.ret_msg == 'OK') {
        console.log(`Successful transaction id: ${txCEX.result.id}, toAddress: ${address}`);
    } else {
        console.log(`Error: ${txCEX.ret_msg}`);
    }
}