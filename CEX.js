import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import crypto from 'crypto';
import axios from 'axios';
import { InverseClient, LinearClient, SpotClientV3, AccountAssetClient } from 'bybit-api';

//BINANCE
export const getCoinBalanceBinance = async(coin, apiSecret, apiKey) => {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const sign = crypto
    .createHmac('sha256', apiSecret)
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
                'X-MBX-APIKEY': apiKey
            }
        }
    );

    if (!response.data[0]) {
        return 0;
    } else if (response.data[0]) {
        return Number(response.data[0].free);
    }
}

export const withdrawBinance = async(coin, network, toAddress, amount, apiSecret, apiKey) => {
    const timestamp = Date.now();
    const recvWindow = 5000;
    const sign = crypto
    .createHmac('sha256', apiSecret)
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
                'X-MBX-APIKEY': apiKey
            }
        }
    )

    return response.data.id;
}

//OKX
export const balanceOKX = async(coin, apiSecret, apiKey, apiPassphrase) => {
    const date = Date.now()/1000
    const sign = Base64.stringify(hmacSHA256(date + 'GET' + `/api/v5/asset/balances?ccy=${coin}`, apiSecret));
    const response = await axios.get('https://www.okx.com' + `/api/v5/asset/balances?ccy=${coin}`, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
            'OK-ACCESS-TIMESTAMP': date,
        }
    })

    return response.data.data[0].availBal;
}

export const withdrawalOKX = async(coin, amount, address, fee, chain, apiSecret, apiKey, apiPassphrase) => {
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
    const sign = Base64.stringify(hmacSHA256(date + 'POST' + '/api/v5/asset/withdrawal' + data, apiSecret));
    const response = await axios.post('https://www.okx.com/api/v5/asset/withdrawal', data, {
        headers: {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': sign,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
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
export const clientBYBIT = (apiSecret, apiKey) => {
    const client = new AccountAssetClient({
        key: apiKey,
        secret: apiSecret,
        testnet: false
    });

    return client;
}

export const balanceBYBIT = async(coin, apiSecret, apiKey) => {
    clientBYBIT(apiSecret, apiKey).then(async(cli) => {
        let coinBalance = await cli.getAssetInformation();
        coinBalance = coinBalance.result.spot.assets.find(el => el.coin == coin).free;

        return coinBalance;
    });
}

export const withdrawalBYBIT = async(coin, chain, amount, address, apiSecret, apiKey) => {
    clientBYBIT(apiSecret, apiKey).then(async(cli) => {
        const txCEX = await cli.submitWithdrawal({
            coin: coin,
            chain: chain,
            address: address,
            amount: amount,
            //timestamp: ,
        });
    
        if (txCEX.ret_msg == 'OK') {
            console.log(`Successful transaction id: ${txCEX.result.id}, toAddress: ${address}`);
        } else {
            console.log(`Error: ${txCEX.ret_msg}`);
        }
    });
}