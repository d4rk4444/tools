import { timeout } from './other.js';
import HttpsProxyAgent from 'https-proxy-agent';
import axiosProxy from 'axios-https-proxy-fix';
import ac from '@antiadmin/anticaptchaofficial';

export const claimETHGoerli = async(apiAntiCaptcha, address, proxy) => {
    ac.setAPIKey(apiAntiCaptcha);
    ac.getBalance()
        .then(balance => console.log(`Balance: ${balance}`))
        .catch(err => console.log(`Error API balance: ${err}`));

    const token = await ac.solveRecaptchaV2Proxyless('https://www.allthatnode.com/faucet/ethereum.dsrv', '6Lf4qnYfAAAAAMHpsGAYma_WEWH6I9YCfrx7yLNb')
    .catch(error => console.log('test received error ' + error));

    const httpAgent = new HttpsProxyAgent({host: (proxy.split('@')[1]).slice(0, -6), port: proxy.slice(-5), auth: proxy.split('@')[0]})

    const req = await axiosProxy.get('https://www.allthatnode.com/FaucetSvl.dsrv?protocol=ETHEREUM&network=GOERLI&address=' + address + '&recaptcha=' + token, {
        httpAgent: httpAgent, 
    })
    .catch(error => console.log('Request error ' + error));

    return req.data;
}