 const ABI = [
    {
        "inputs": [
            {
                "internalType":"address",
                "name":"_account",
                "type":"address"
            }
        ],
        "name":"getAccountDividendsInfo",
        "outputs": [
            {
                "internalType":"address",
                "name":"account",
                "type":"address"
            },
            {
                "internalType":"uint256",
                "name":"withdrawableDividends",
                "type":"uint256"
            },
            {
                "internalType":"uint256",
                "name":"totalDividends",
                "type":"uint256"
            },
            {
                "internalType":"uint256",
                "name":"lastClaimTime",
                "type":"uint256"
            },
            {
                "internalType":"uint256",
                "name":"nextClaimTime",
                "type":"uint256"
            },
            {
                "internalType":"uint256",
                "name":"secondsUntilAutoClaimAvailable",
                "type":"uint256"
            }
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"claim",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    }
]
export default ABI;