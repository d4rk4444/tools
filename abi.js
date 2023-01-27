export const abiToken = [
    {
        "type":"function",
        "name":"balanceOf",
        "inputs": [{"name":"account","type":"address"}],
        "outputs": [{"name":"amount","type":"uint256"}]
    },
    {
        "type":"function",
        "name":"allowance",
        "inputs": [
            {"name":"owner","type":"address"},
            {"name":"spender","type":"address"}
        ],
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
    },
    {
        "type":"function",
        "name":"swapExactTokensForTokens",
        "inputs": [
            {"name":"_amountIn","type":"uint256"},
            {"name":"_amountOutMin","type":"uint256"},
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
    },
    {
        "type":"function",
        "name":"estimateSendAndCallFee",
        "inputs": [
            {"name":"_dstChainId","type":"uint16"},
            {"name":"_toAddress","type":"bytes32"},
            {"name":"_amount","type":"uint256"},
            {"name":"_payload","type":"bytes"},
            {"name":"_dstGasForCall","type":"uint64"},
            {"name":"_useZro","type":"bool"},
            {"name":"_adapterParams","type":"bytes"}
        ],
        "outputs": [
            {"name":"nativeFee","type":"uint256"},
            {"name":"zroFee","type":"uint256"}
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
    },
    {
        "type":"function",
        "name":"quoteLayerZeroFee",
        "inputs": [
            {"name":"_dstChainId","type":"uint16"},
            {"name":"_functionType","type":"uint8"},
            {"name":"_toAddress","type":"bytes"},
            {"name":"_transferAndCallPayload","type":"bytes"},
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
            }
        ],
        "outputs": [
            {"name":"nativeFee","type":"uint256"},
            {"name":"zroFee","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"create_lock",
        "inputs": [
            {"name":"_value","type":"uint256"},
            {"name":"_unlock_time","type":"uint256"},
        ]
    },
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
    },
    {
        "type":"function",
        "name":"quoteForSend",
        "inputs": [
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
        ],
        "outputs": [
            {"name":"nativeFee","type":"uint256"},
            {"name":"zroFee","type":"uint256"}
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
            {"name":"sig","type":"bytes"}
        ]
    },
]

export const abiGalaxy = [
    {
        "type":"function",
        "name":"galaxy_signer",
        "inputs": [
        ],
        "outputs": [
            {"name":"galaxy_signer","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"manager",
        "inputs": [
        ],
        "outputs": [
            {"name":"r0","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"treasury_manager",
        "inputs": [
        ],
        "outputs": [
            {"name":"treasury_manager","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"campaign_setter",
        "inputs": [
        ],
        "outputs": [
            {"name":"campaign_setter","type":"address"},
        ]
    },
    {
        "type":"function",
        "name":"_hash",
        "inputs": [
            {"name":"_cid","type":"uint256"},
            {"name":"_starNFT","type":"address"},
            {"name":"_dummyId","type":"uint256"},
            {"name":"_powah","type":"uint256"},
            {"name":"_account","type":"address"},
        ],
        "outputs": [
            {"name":"hash","type":"bytes32"},
        ]
    },
    {
        "type":"function",
        "name":"claim",
        "inputs": [
            {"name":"_cid","type":"uint256"},
            {"name":"_starNFT","type":"address"},
            {"name":"_dummyId","type":"uint256"},
            {"name":"_powah","type":"uint256"},
            {"name":"_signature","type":"bytes"},
        ],
    },
    {// 0x81b30ff521d1feb67ede32db726d95714eb00637
        "type":"function",
        "name":"mintToken",
        "inputs": [
            {"name":"nftType","type":"uint256"}
        ],
    }
]

export const abiUniswapV3 = [
    //multicall //0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    {
        "type":"function",
        "name":"multicall",
        "inputs": [
            {"name":"deadline","type":"uint256"},
            {"name":"data","type":"bytes[]"},
        ],
    },
    //exactInputSingle
    {
        "type":"function",
        "name":"exactInputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [{
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "name": "fee",
                    "type": "uint24"
                },
                {
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "name": "amountOutMinimum",
                    "type": "uint256"
                },
                {
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                }]
            }
        ]
    },
    //quoteExactInputSingle //0x61fFE014bA17989E743c5F6cB21bF9697530B21e
    {
        "type":"function",
        "name":"quoteExactInputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [{
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "name": "amountIn",
                    "type": "uint256"
                },
                {
                    "name": "fee",
                    "type": "uint24"
                },
                {
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                }]
            }
        ],
        "outputs": [
            {"name":"amountOut","type":"uint256"},
            {"name":"sqrtPriceX96After","type":"uint160"},
            {"name":"initializedTicksCrossed","type":"uint32"},
            {"name":"gasEstimate","type":"uint256"},
        ]
    },
    //quoteExactOutputSingle
    {
        "type":"function",
        "name":"quoteExactOutputSingle",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [{
                    "name": "tokenIn",
                    "type": "address"
                },
                {
                    "name": "tokenOut",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "name": "fee",
                    "type": "uint24"
                },
                {
                    "name": "sqrtPriceLimitX96",
                    "type": "uint160"
                }]
            }
        ],
        "outputs": [
            {"name":"amountIn","type":"uint256"},
            {"name":"sqrtPriceX96After","type":"uint160"},
            {"name":"initializedTicksCrossed","type":"uint32"},
            {"name":"gasEstimate","type":"uint256"},
        ]
    },
]

export const abiPoolTogether = [
    //depositToAndDelegate //0x79bc8bd53244bc8a9c8c27509a2d573650a83373
    {
        "type":"function",
        "name":"depositToAndDelegate",
        "inputs": [
            {"name":"_to","type":"address"},
            {"name":"_amount","type":"uint256"},
            {"name":"_delegate","type":"address"}
        ],
    },
]

export const abiSynapse = [
    {
        "type":"function",
        "name":"addLiquidity",
        "inputs": [
            {"name":"amounts","type":"uint256[]"},
            {"name":"minToMint","type":"uint256"},
            {"name":"deadline","type":"uint256"},
        ]
    },
    {
        "type":"function",
        "name":"removeLiquidityOneToken",
        "inputs": [
            {"name":"tokenAmount","type":"uint256"},
            {"name":"tokenIndex","type":"uint8"},
            {"name":"minAmount","type":"uint256"},
            {"name":"deadline","type":"uint256"},
        ]
    },
]

export const abiPika = [
    {
        "type":"function",
        "name":"getPrice",
        "inputs": [
            {"name":"token","type":"address"}
        ],
        "outputs": [
            {"name":"price","type":"uint256"},
        ]
    },
    {
        "type":"function",
        "name":"createOpenPosition",
        "inputs": [
            {"name":"_productId","type":"uint256"},
            {"name":"_margin","type":"uint256"},
            {"name":"_leverage","type":"uint256"},
            {"name":"_isLong","type":"bool"},
            {"name":"_acceptablePrice","type":"uint256"},
            {"name":"_executionFee","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"createClosePosition",
        "inputs": [
            {"name":"_productId","type":"uint256"},
            {"name":"_margin","type":"uint256"},
            {"name":"_isLong","type":"bool"},
            {"name":"_acceptablePrice","type":"uint256"},
            {"name":"_executionFee","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"stake",
        "inputs": [
            {"name":"amount","type":"uint256"},
            {"name":"user","type":"address"}
        ]
    },
    {
        "type":"function",
        "name":"getPosition",
        "inputs": [
            {"name":"account","type":"address"},
            {"name":"productId","type":"uint256"},
            {"name":"isLong","type":"bool"}
        ],
        "outputs": [
            {"name":"productId","type":"uint256"},
            {"name":"leverage","type":"uint256"},
            {"name":"?","type":"uint256"},
            {"name":"?","type":"uint256"},
            {"name":"margin","type":"uint256"},
            {"name":"trader","type":"address"},
            {"name":"deadline","type":"uint256"},
            {"name":"isLong","type":"bool"},
            {"name":"?","type":"int256"},
        ]
    },
]

export const abiPerpetual = [
    {//0xad7b4c162707e0b2b5f6fddbd3f8538a5fba0d60
        "type":"function",
        "name":"deposit",
        "inputs": [
            {"name":"token","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {
        "type":"function",
        "name":"withdraw",
        "inputs": [
            {"name":"token","type":"address"},
            {"name":"amount","type":"uint256"}
        ]
    },
    {//0x82ac2ce43e33683c58be4cdc40975e73aa50f459
        "type":"function",
        "name":"openPosition",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [
                    {
                        "name": "baseToken",
                        "type": "address"
                    },
                    {
                        "name": "isBaseToQuote",
                        "type": "bool"
                    },
                    {
                        "name": "isExactInput",
                        "type": "bool"
                    },
                    {
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "name": "oppositeAmountBound",
                        "type": "uint256"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160"
                    },
                    {
                        "name": "referralCode",
                        "type": "bytes32"
                    }
                ]
            },
        ]
    },
    {
        "type":"function",
        "name":"closePosition",
        "inputs": [
            {
                "name":"params",
                "type":"tuple",
                "components": [
                    {
                        "name": "baseToken",
                        "type": "address"
                    },
                    {
                        "name": "sqrtPriceLimitX96",
                        "type": "uint160"
                    },
                    {
                        "name": "oppositeAmountBound",
                        "type": "uint256"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "name": "referralCode",
                        "type": "bytes32"
                    }
                ]
            },
        ]
    },
    {
        "type":"function",
        "name":"getIndexPrice",
        "inputs": [
            {"name":"interval","type":"uint256"}
        ],
        "outputs": [
            {"name":"price","type":"uint256"},
        ]
    },
    {
        "type":"function",
        "name":"getAccountValue",
        "inputs": [
            {"name":"trader","type":"address"}
        ],
        "outputs": [
            {"name":"value","type":"int256"},
        ]
    },
    {//0xA7f3FC32043757039d5e13d790EE43edBcBa8b7c
        "type":"function",
        "name":"getTotalPositionSize",
        "inputs": [
            {"name":"trader","type":"address"},
            {"name":"baseToken","type":"address"}
        ],
        "outputs": [
            {"name":"size","type":"int256"},
        ]
    },
]

export const abiStarknetBridge = [
    {
        "type":"function",
        "name":"deposit",
        "inputs": [
            {"name":"l2Recipient","type":"uint256"}
        ]
    },
]

export const abiMySwapStarknet = [
    {
        "members": [
            {
                "name": "low",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "high",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Uint256",
        "size": 2,
        "type": "struct"
    },
    {
        "members": [
            {
                "name": "name",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "token_a_address",
                "offset": 1,
                "type": "felt"
            },
            {
                "name": "token_a_reserves",
                "offset": 2,
                "type": "Uint256"
            },
            {
                "name": "token_b_address",
                "offset": 4,
                "type": "felt"
            },
            {
                "name": "token_b_reserves",
                "offset": 5,
                "type": "Uint256"
            },
            {
                "name": "fee_percentage",
                "offset": 7,
                "type": "felt"
            },
            {
                "name": "cfmm_type",
                "offset": 8,
                "type": "felt"
            },
            {
                "name": "liq_token",
                "offset": 9,
                "type": "felt"
            }
        ],
        "name": "Pool",
        "size": 10,
        "type": "struct"
    },
    {
        "inputs": [
            {
            "name": "pool_id",
            "type": "felt"
            }
        ],
        "name": "get_pool",
        "outputs": [
            {
            "name": "pool",
            "type": "Pool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
    {
        "inputs": [
            {
                "name": "pool_id",
                "type": "felt"
            }
        ],
        "name": "get_total_shares",
        "outputs": [
            {
                "name": "total_shares",
                "type": "Uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
]

export const abiStarknetId = [
    {
        "members": [
            {
                "name": "low",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "high",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Uint256",
        "size": 2,
        "type": "struct"
    },
    {
        "inputs": [
            {
            "name": "starknet_id",
            "type": "Uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
            "name": "approved",
            "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function",
    },
]