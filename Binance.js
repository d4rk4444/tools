import crypto from 'crypto';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config()

export async function getCoinBalance(coin) {
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

export async function withdraw(coin, network, toAddress, amount) {
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