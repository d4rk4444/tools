import hmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config()


export async function balanceOKX(coin) {
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

export async function withdrawalOKX(coin, amount, address, fee, chain) {
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