export const abiToken = [
    {
        "type":"function",
        "name":"balanceOf",
        "inputs": [{"name":"account","type":"address"}],
        "outputs": [{"name":"amount","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"transfer",
        "inputs": [
            {"name":"recipient","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"transferFrom",
        "inputs": [
            {"name":"sender","type":"address"},
            {"name":"recipient","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"approve",
        "inputs": [
            {"name":"spender","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    }
]

export const abiTraderJoe = [
    {
        "type":"function",
        "name":"getAmountsOut",
        "inputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"path","type":"address[]"},
        ],
        "outputs": [
            {"name":"amounts","type":"uint256[]"},
        ]
    },
    {
        "type":"function",
        "name":"swapExactAVAXForTokens",
        "inputs": [
            {"name":"_amountOutMin","type":"uint256"},
            {"name":"_pairBinSteps","type":"uint256[]"},
            {"name":"_tokenPath","type":"address[]"},
            {"name":"_to","type":"address"},
            {"name":"_deadline","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"swapExactTokensForAVAX",
        "inputs": [
            {"name":"_amountIn","type":"uint256"},
            {"name":"_amountOutMinAVAX","type":"uint256"},
            {"name":"_pairBinSteps","type":"uint256[]"},
            {"name":"_tokenPath","type":"address[]"},
            {"name":"_to","type":"address"},
            {"name":"_deadline","type":"uint256"}
        ]
    }
]

export const abiBtcBridge = [
    {
        "type":"function",
        "name":"sendFrom",
        "inputs": [
            {"name":"_from","type":"address"},
            {"name":"_dstChainId","type":"uint16"},
            {"name":"_toAddress","type":"bytes32"},
            {"name":"_amount","type":"uint256"},
            {"name":"_minAmount","type":"uint256"},
            {
                "name":"_callParams",
                "type":"tuple",
                "components": [{
                    "name": "refundAddress",
                    "type": "address"
                },
                {
                    "name": "zroPaymentAddress",
                    "type": "address"
                },
                {
                    "name": "adapterParams",
                    "type": "bytes"
                }]
            }
        ]
    }
]

export const abiStargate = [
    {
        "type":"function",
        "name":"swap",
        "inputs": [
            {"name":"_dstChainId","type":"uint16"},
            {"name":"_srcPoolId","type":"uint256"},
            {"name":"_dstPoolId","type":"uint256"},
            {"name":"_refundAddress","type":"address"},
            {"name":"_amountLD","type":"uint256"},
            {"name":"_minAmountLD","type":"uint256"},
            {
                "name":"_lzTxParams",
                "type":"tuple",
                "components": [{
                    "name": "dstGasForCall",
                    "type": "uint256"
                },
                {
                    "name": "dstNativeAmount",
                    "type": "uint256"
                },
                {
                    "name": "dstNativeAddr",
                    "type": "bytes"
                }]
            },
            {"name":"_to","type":"bytes"},
            {"name":"_payload","type":"bytes"}
        ]
    }
]

export const abiAptosBridge = [
    {
        "type":"function",
        "name":"sendToAptos",
        "inputs": [
            {"name":"_token","type":"address"},
            {"name":"_toAddress","type":"bytes32"},
            {"name":"_amountLD","type":"uint256"},
            {
                "name":"_callParams",
                "type":"tuple",
                "components": [{
                    "name": "refundAddress",
                    "type": "address"
                },
                {
                    "name": "zroPaymentAddress",
                    "type": "address"
                }]
            },
            {"name":"_adapterParams","type":"bytes"},
        ]
    }
]

export const abiBebop = [
    {
        "type":"function",
        "name":"deposit",
        "inputs": [
        ]
    },
    {
        "type":"function",
        "name":"SettleOrder",
        "inputs": [
            {
                "name":"order",
                "type":"tuple",
                "components": [{
                    "name": "expiry",
                    "type": "uint256"
                },
                {
                    "name": "taker_address",
                    "type": "address"
                },
                {
                    "name": "maker_address",
                    "type": "address"
                },
                {
                    "name": "base_token",
                    "type": "address"
                },
                {
                    "name": "quote_token",
                    "type": "address"
                },
                {
                    "name": "base_quantity",
                    "type": "uint256"
                },
                {
                    "name": "quote_quantity",
                    "type": "uint256"
                },
                {
                    "name": "receiver",
                    "type": "address"
                }]
            },
            //{"name":"sig","type":"bytes"}
        ]
    },
]