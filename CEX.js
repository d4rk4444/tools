import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import crypto from 'crypto';
import axios from 'axios';
import { InverseClient, LinearClient, SpotClientV3, AccountAssetClient } from 'bybit-api';
import * as dotenv from 'dotenv';
dotenv.config()

//BINANCE
export const getCoinBalanceBinance = async(coin) => {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const sign = crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET)
    .update(`asset=${coin}&recvWindow=${recvWindow}&timestamp=${timestamp}`)
    .digest('hex');

    const response = await axios.post(
        'https://api.binance.com/sapi/v3/asset/getUserAsset',
        '',
        {
            params: {
                'asset': coin,
                'recvWindow': recvWindow,
                'timestamp': timestamp,
                'signature': sign
            },
            headers: {
                'X-MBX-APIKEY': process.env.BINANCE_API_KEY
            }
        }
    );

    if (!response.data[0]) {
        return 0;
    } else if (response.data[0]) {
        return Number(response.data[0].free);
    }
}

export const withdrawBinance = async(coin, network, toAddress, amount) => {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const sign = crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET)
    .update(`coin=${coin}&network=${network}&address=${toAddress}&amount=${amount}&recvWindow=${recvWindow}&timestamp=${timestamp}`)
    .digest('hex');

    const response = await axios.post(
        'https://api.binance.com/sapi/v1/capital/withdraw/apply',
        '',
        {
            params: {
                'coin': coin,
                'network': network,
                'address': toAddress,
                'amount': amount,
                'recvWindow': recvWindow,
                'timestamp': timestamp,
                'signature': sign
            },
            headers: {
                'X-MBX-APIKEY': process.env.BINANCE_API_KEY
            }
        }
    )

    return response.data.id;
}

//OKX
export const balanceOKX = async(coin) => {
    const date = Date.now()/1000
    const sign = Base64.stringify(hmacSHA256(date + 'GET' + `/api/v5/asset/balances?ccy=${coin}`, process.env.API_SECRET_OKEX));
    const response = await axios.get('https://www.okx.com' + `/api/v5/asset/balances?ccy=${coin}`, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': process.env.API_KEY_OKEX,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': process.env.API_PASSPHRASE_OKEX,
            'OK-ACCESS-TIMESTAMP': date,
        }
    })

    return response.data.data[0].availBal;
}

export const withdrawalOKX = async(coin, amount, address, fee, chain) => {
    const date = Date.now()/1000
    let data = { 
        ccy: coin,
        amt: amount,
        dest: '4',
        toAddr: address,
        fee: fee,
        chain: chain,
    };
    data = JSON.stringify(data);
    const sign = Base64.stringify(hmacSHA256(date + 'POST' + '/api/v5/asset/withdrawal' + data, process.env.API_SECRET_OKEX));
    const response = await axios.post('https://www.okx.com/api/v5/asset/withdrawal', data, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': process.env.API_KEY_OKEX,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': process.env.API_PASSPHRASE_OKEX,
            'OK-ACCESS-TIMESTAMP': date,
        }
    });

    if (response.data.msg == '') {
        console.log(`Successful transaction id: ${response.data.data[0].wdId}, toAddress: ${address}`);
    } else if (response.data.msg != '') {
        console.log(`Error transaction: ${response.data.msg}, toAddress: ${address}`);
    }
}

//BYBIT
const client = new AccountAssetClient({
    key: process.env.API_KEY_BYBIT,
    secret: process.env.API_SECRET_BYBIT,
    testnet: false
});

export const balanceBYBIT = async(coin) => {
    let coinBalance = await client.getAssetInformation()
    coinBalance = coinBalance.result.spot.assets.find(el => el.coin == coin).free

    return coinBalance;
}

export const withdrawalBYBIT = async(coin, chain, amount, address) => {
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