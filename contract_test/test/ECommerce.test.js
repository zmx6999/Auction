const Web3=require("web3")
const ganache=require("ganache-cli")
const web3=new Web3(ganache.provider())
const abi=[ { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "voteForSeller", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "goodsId", "type": "uint256" }, { "name": "idealPrice", "type": "uint256" }, { "name": "secret", "type": "string" } ], "name": "bid", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "escrowInfo", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "bool" }, { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "voteForBuyer", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "goodsId", "type": "uint256" }, { "name": "idealPrice", "type": "uint256" }, { "name": "secret", "type": "string" } ], "name": "revealBid", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "getGoods", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "string" }, { "name": "", "type": "string" }, { "name": "", "type": "string" }, { "name": "", "type": "string" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "escrowBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalGoods", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "finalizeAuction", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "name", "type": "string" }, { "name": "category", "type": "string" }, { "name": "imageLink", "type": "string" }, { "name": "introLink", "type": "string" }, { "name": "condition", "type": "uint256" }, { "name": "startPrice", "type": "uint256" }, { "name": "auctionStartTime", "type": "uint256" }, { "name": "auctionEndTime", "type": "uint256" } ], "name": "addGoods", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "goodsId", "type": "uint256" } ], "name": "bidInfo", "outputs": [ { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "address" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]
const bytecode="608060405234801561001057600080fd5b50612c7d806100206000396000f3006080604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe0146100bf578063218f7c87146100ea57806376d4fc57146101175780638356052514610187578063894c77d71461027e578063a489d5d7146102ab578063b259003314610328578063bb099ee31461053c578063da21627b1461057d578063e8083863146105a8578063ea026902146105d5578063f653aa0414610738575b600080fd5b3480156100cb57600080fd5b506100d46107ba565b6040518082815260200191505060405180910390f35b3480156100f657600080fd5b50610115600480360381019080803590602001909291905050506107d9565b005b6101856004803603810190808035906020019092919080359060200190929190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091929192905050506108c2565b005b34801561019357600080fd5b506101b260048036038101908080359060200190929190505050610c16565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001831515151581526020018215151515815260200197505050505050505060405180910390f35b34801561028a57600080fd5b506102a960048036038101908080359060200190929190505050610d7f565b005b3480156102b757600080fd5b506103266004803603810190808035906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610e68565b005b34801561033457600080fd5b506103536004803603810190808035906020019092919050505061127c565b604051808b8152602001806020018060200180602001806020018a815260200189815260200188815260200187815260200186815260200185810385528e818151815260200191508051906020019080838360005b838110156103c35780820151818401526020810190506103a8565b50505050905090810190601f1680156103f05780820380516001836020036101000a031916815260200191505b5085810384528d818151815260200191508051906020019080838360005b8381101561042957808201518184015260208101905061040e565b50505050905090810190601f1680156104565780820380516001836020036101000a031916815260200191505b5085810383528c818151815260200191508051906020019080838360005b8381101561048f578082015181840152602081019050610474565b50505050905090810190601f1680156104bc5780820380516001836020036101000a031916815260200191505b5085810382528b818151815260200191508051906020019080838360005b838110156104f55780820151818401526020810190506104da565b50505050905090810190601f1680156105225780820380516001836020036101000a031916815260200191505b509e50505050505050505050505050505060405180910390f35b34801561054857600080fd5b50610567600480360381019080803590602001909291905050506116ac565b6040518082815260200191505060405180910390f35b34801561058957600080fd5b50610592611787565b6040518082815260200191505060405180910390f35b3480156105b457600080fd5b506105d36004803603810190808035906020019092919050505061178d565b005b3480156105e157600080fd5b50610736600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190803590602001909291908035906020019092919080359060200190929190505050611b18565b005b34801561074457600080fd5b5061076360048036038101908080359060200190929190505050611d92565b604051808581526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200194505050505060405180910390f35b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b6003600082815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e8ef23b5336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b1580156108a757600080fd5b505af11580156108bb573d6000803e3d6000fd5b5050505050565b6000806002600086815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561093357600080fd5b60016000868152602001908152602001600020915042826007015411158015610960575081600801544211155b151561096b57600080fd5b8160060154841015151561097e57600080fd5b83836040516020018083815260200182805190602001908083835b6020831015156109be5780518252602082019150602081019050602083039250610999565b6001836020036101000a038019825116818451168082178552505050505050905001925050506040516020818303038152906040526040518082805190602001908083835b602083101515610a285780518252602082019150602081019050602083039250610a03565b6001836020036101000a03801982511681845116808217855250505050505090500191505060405180910390209050600082600d0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000836000191660001916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610af957600080fd5b600182600c01600082825401925050819055506060604051908101604052803373ffffffffffffffffffffffffffffffffffffffff1681526020016000151581526020013481525082600d0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000836000191660001916815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548160ff021916908315150217905550604082015181600101559050505050505050565b60008060008060008060006003600089815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166390eca5e8336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060e060405180830381600087803b158015610cef57600080fd5b505af1158015610d03573d6000803e3d6000fd5b505050506040513d60e0811015610d1957600080fd5b81019080805190602001909291908051906020019092919080519060200190929190805190602001909291908051906020019092919080519060200190929190805190602001909291905050509650965096509650965096509650919395979092949650565b6003600082815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1509cf7336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b158015610e4d57600080fd5b505af1158015610e61573d6000803e3d6000fd5b5050505050565b600080600080600160008881526020019081526020016000209350836008015442111515610e9557600080fd5b85856040516020018083815260200182805190602001908083835b602083101515610ed55780518252602082019150602081019050602083039250610eb0565b6001836020036101000a038019825116818451168082178552505050505050905001925050506040516020818303038152906040526040518082805190602001908083835b602083101515610f3f5780518252602082019150602081019050602083039250610f1a565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020925083600d0160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008460001916600019168152602001908152602001600020915060008260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1611151561101357600080fd5b8160000160149054906101000a900460ff1615151561103157600080fd5b60009050816001015486111561104d5781600101549050611205565b83600901548611156111da57600084600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141561110357858460090181905550836006015484600a01819055503384600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508582600101540390506111d5565b83600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc85600901549081150290604051600060405180830381858888f19350505050158015611171573d6000803e3d6000fd5b50836009015484600a01819055508584600901819055503384600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508582600101540390505b611204565b83600a01548611156111fb578584600a018190555081600101549050611203565b816001015490505b5b5b60018260000160146101000a81548160ff0219169083151502179055506000811115611273573373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611271573d6000803e3d6000fd5b505b50505050505050565b60006060806060806000806000806000611294612168565b600160008d81526020019081526020016000206101c0604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113575780601f1061132c57610100808354040283529160200191611357565b820191906000526020600020905b81548152906001019060200180831161133a57829003601f168201915b50505050508152602001600282018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113f95780601f106113ce576101008083540402835291602001916113f9565b820191906000526020600020905b8154815290600101906020018083116113dc57829003601f168201915b50505050508152602001600382018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561149b5780601f106114705761010080835404028352916020019161149b565b820191906000526020600020905b81548152906001019060200180831161147e57829003601f168201915b50505050508152602001600482018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561153d5780601f106115125761010080835404028352916020019161153d565b820191906000526020600020905b81548152906001019060200180831161152057829003601f168201915b505050505081526020016005820160009054906101000a900460ff16600281111561156457fe5b600281111561156f57fe5b81526020016005820160019054906101000a900460ff16600181111561159157fe5b600181111561159c57fe5b815260200160068201548152602001600782015481526020016008820154815260200160098201548152602001600a8201548152602001600b820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600c820154815250509050806000015181602001518260400151836060015184608001518560a00151600281111561165d57fe5b8660c00151600181111561166d57fe5b8760e001518861010001518961012001518898508797508696508595509a509a509a509a509a509a509a509a509a509a50509193959799509193959799565b60006003600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166312065fe06040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b15801561174557600080fd5b505af1158015611759573d6000803e3d6000fd5b505050506040513d602081101561176f57600080fd5b81019080805190602001909291905050509050919050565b60005481565b60008060006001600085815260200190815260200160002092508260080154421115156117b957600080fd5b6002600085815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561182757600080fd5b82600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561188657600080fd5b6000600281111561189357fe5b8360050160009054906101000a900460ff1660028111156118b057fe5b1415156118bc57600080fd5b600083600c015414156118f45760028360050160006101000a81548160ff021916908360028111156118ea57fe5b0217905550611b12565b82600a0154836009015403915060008211156119765782600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015611974573d6000803e3d6000fd5b505b82600a015483600b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166002600087815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16336119dd612204565b808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200193505050506040518091039082f080158015611a94573d6000803e3d6000fd5b5090509050806003600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018360050160006101000a81548160ff02191690836002811115611b0c57fe5b02179055505b50505050565b600160008082825401925050819055506101c060405190810160405280600054815260200189815260200188815260200187815260200186815260200160006002811115611b6257fe5b8152602001856001811115611b7357fe5b6001811115611b7e57fe5b81526020018481526020018381526020018281526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152506001600080548152602001908152602001600020600082015181600001556020820151816001019080519060200190611bff929190612214565b506040820151816002019080519060200190611c1c929190612214565b506060820151816003019080519060200190611c39929190612214565b506080820151816004019080519060200190611c56929190612214565b5060a08201518160050160006101000a81548160ff02191690836002811115611c7b57fe5b021790555060c08201518160050160016101000a81548160ff02191690836001811115611ca457fe5b021790555060e0820151816006015561010082015181600701556101208201518160080155610140820151816009015561016082015181600a015561018082015181600b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506101a082015181600c015590505033600260008054815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050505050565b600080600080611da0612168565b600160008781526020019081526020016000206101c0604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611e635780601f10611e3857610100808354040283529160200191611e63565b820191906000526020600020905b815481529060010190602001808311611e4657829003601f168201915b50505050508152602001600282018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611f055780601f10611eda57610100808354040283529160200191611f05565b820191906000526020600020905b815481529060010190602001808311611ee857829003601f168201915b50505050508152602001600382018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611fa75780601f10611f7c57610100808354040283529160200191611fa7565b820191906000526020600020905b815481529060010190602001808311611f8a57829003601f168201915b50505050508152602001600482018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120495780601f1061201e57610100808354040283529160200191612049565b820191906000526020600020905b81548152906001019060200180831161202c57829003601f168201915b505050505081526020016005820160009054906101000a900460ff16600281111561207057fe5b600281111561207b57fe5b81526020016005820160019054906101000a900460ff16600181111561209d57fe5b60018111156120a857fe5b815260200160068201548152602001600782015481526020016008820154815260200160098201548152602001600a8201548152602001600b820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001600c820154815250509050806101400151816101600151826101800151836101a001519450945094509450509193509193565b6101c0604051908101604052806000815260200160608152602001606081526020016060815260200160608152602001600060028111156121a557fe5b8152602001600060018111156121b757fe5b81526020016000815260200160008152602001600081526020016000815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600081525090565b604051610998806122ba83390190565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061225557805160ff1916838001178555612283565b82800160010185558215612283579182015b82811115612282578251825591602001919060010190612267565b5b5090506122909190612294565b5090565b6122b691905b808211156122b257600081600090555060010161229a565b5090565b9056006080604052604051606080610998833981018060405281019080805190602001909291908051906020019092919080519060200190929190505050826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505061088a8061010e6000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806312065fe01461006757806390eca5e814610092578063e1509cf71461019f578063e8ef23b5146101e2575b600080fd5b34801561007357600080fd5b5061007c610225565b6040518082815260200191505060405180910390f35b34801561009e57600080fd5b506100d3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610244565b604051808873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001858152602001848152602001831515151581526020018215151515815260200197505050505050505060405180910390f35b3480156101ab57600080fd5b506101e0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610333565b005b3480156101ee57600080fd5b50610223600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506105c8565b005b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b60008060008060008060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600354600454600560008e73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16600660009054906101000a900460ff169650965096509650965096509650919395979092949650565b80600660009054906101000a900460ff1615151561035057600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806103f85750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b806104505750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b151561045b57600080fd5b600560008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515156104b457600080fd5b60016003600082825401925050819055506001600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060026003541015156105c4576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156105a7573d6000803e3d6000fd5b506001600660006101000a81548160ff0219169083151502179055505b5050565b80600660009054906101000a900460ff161515156105e557600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16148061068d5750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b806106e55750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16145b15156106f057600080fd5b600560008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151561074957600080fd5b60016004600082825401925050819055506001600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600260045410151561085a57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f1935050505015801561083d573d6000803e3d6000fd5b506001600660006101000a81548160ff0219169083151502179055505b50505600a165627a7a723058205c0c4b3bda2e79af8e662b6d361ae8344dc23aedde3d6b9071361e240300dbaf0029a165627a7a7230582042375cef1588d2ba96a1cf4b1deda1ae035952e53128c62d39e8c2eafa5fed8f0029"
const wait=t => {
    let t1=parseFloat(new Date()/1000)
    let t2
    while (true) {
        t2=parseFloat(new Date()/1000)
        if (t2-t1>=t) return
    }
}

const assert=require("assert")

let instance
let accounts

beforeEach(async () => {
    accounts=await web3.eth.getAccounts()
    instance=await new web3.eth.Contract(abi).deploy({data:bytecode}).send({from:accounts[0],gasLimit:4000000})
})

describe("ECommerce",() => {
    it("bid role",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[0],gas:3000000,value:web3.utils.toWei("0.8","ether")})
    })

    it("bid period",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now+60,now+600).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
    })

    it("bid startPrice",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei(".2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
    })

    it("bid period2",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now-600,now-60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
    })

    it("bid repeat",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
    })

    it("revealBid period",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000})
    })

    it("revealBid repeat",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        wait(61)
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000})
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000})
    })

    it("revealBid role",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        wait(61)
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[0],gas:3000000})
    })

    it("revealBid idealPrice",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        wait(61)
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.1","ether"),"a1").send({from:accounts[1],gas:3000000})
    })

    it("revealBid secret",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        wait(61)
        await instance.methods.revealBid(totalGoods,web3.utils.toWei("1.2","ether"),"a3").send({from:accounts[1],gas:3000000})
    })

    it("finalizeAuction period",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        await instance.methods.bid(totalGoods,web3.utils.toWei("1.2","ether"),"a1").send({from:accounts[1],gas:3000000,value:web3.utils.toWei("0.8","ether")})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
    })

    it("finalizeAuction role",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[0],gas:3000000})
    })

    it("finalizeAuction role2",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[3],gas:3000000})
    })

    it("finalizeAuction repeat",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
    })

    it("voteForBuyer role",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[1],gas:3000000})
    })

    it("voteForBuyer repeat",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
    })

    it("voteForBuyer over",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
    })

    it("voteForSeller role",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[1],gas:3000000})
    })

    it("voteForSeller repeat",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
    })

    it("voteForSeller over",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})
        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[6],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
    })

    it("voteForSeller",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})

        let b={}
        for (let i=0;i<=5;i++) {
            b[i]=await web3.eth.getBalance(accounts[i])
            b[i]=web3.utils.fromWei(b[i],"ether")
            b[i]=parseFloat(b[i])
        }

        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})

        let r=await instance.methods.bidInfo(totalGoods).call()
        assert(r[0],web3.utils.toWei("3","ether"),"bidInfo error")
        assert(r[1],web3.utils.toWei("2.6","ether"),"bidInfo error")
        assert(r[2],accounts[3],"bidInfo error")
        assert(r[3],5,"bidInfo error")
        r=await instance.methods.getBalance().call()
        assert(r,web3.utils.toWei("3","ether"),"getBalance error")

        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        r=await instance.methods.escrowBalance(totalGoods).call()
        assert(r,web3.utils.toWei("2.6","ether"),"escrowBalance error")

        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[6],gas:3000000})

        for (let i=0;i<=5;i++) {
            r=await web3.eth.getBalance(accounts[i])
            r=web3.utils.fromWei(r,"ether")
            r=parseFloat(r)
            if(i==0) {
                assert(r,b[i]+2.6,"balance error")
            } else if(i==3) {
                assert(b[i]-2.7<r && r<b[i]-2.6,true,"balance error")
            } else {
                assert(b[i]-0.1<r && r<b[i],true,"balance error")
            }
        }

        r=await instance.methods.getGoods(totalGoods).call()
        assert(r[0],totalGoods,"getGoods error")
        assert(r[1],"iPhone 8","getGoods error")
        assert(r[2],"Mobile Phone","getGoods error")
        assert(r[3],"image","getGoods error")
        assert(r[4],"intro","getGoods error")
        assert(r[5],1,"getGoods error")
        assert(r[6],0,"getGoods error")
        assert(r[7],web3.utils.toWei("1","ether"),"getGoods error")
        assert(r[8],now,"getGoods error")
        assert(r[9],now+60,"getGoods error")
    })

    it("voteForBuyer",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",1,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})

        let b={}
        for (let i=0;i<=5;i++) {
            b[i]=await web3.eth.getBalance(accounts[i])
            b[i]=web3.utils.fromWei(b[i],"ether")
            b[i]=parseFloat(b[i])
        }

        let totalGoods=await instance.methods.totalGoods().call()
        let idealPrices=["1.2","2","3","1.5","2.6"]
        let secrets=["a1","a2","a3","a4","a5"]
        let actualPrices=["0.8","3","3","2.8","2.8"]
        for (let i=0;i<5;i++) await instance.methods.bid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000,value:web3.utils.toWei(actualPrices[i],"ether")})
        wait(61)
        for (let i=0;i<5;i++) await instance.methods.revealBid(totalGoods,web3.utils.toWei(idealPrices[i],"ether"),secrets[i]).send({from:accounts[i+1],gas:3000000})

        let r=await instance.methods.bidInfo(totalGoods).call()
        assert(r[0],web3.utils.toWei("3","ether"),"bidInfo error")
        assert(r[1],web3.utils.toWei("2.6","ether"),"bidInfo error")
        assert(r[2],accounts[3],"bidInfo error")
        assert(r[3],5,"bidInfo error")
        r=await instance.methods.getBalance().call()
        assert(r,web3.utils.toWei("3","ether"),"getBalance error")

        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        r=await instance.methods.escrowBalance(totalGoods).call()
        assert(r,web3.utils.toWei("2.6","ether"),"escrowBalance error")

        let voters=[accounts[0],accounts[3],accounts[6]]
        for(let k=0;k<3;k++) {
            r=await instance.methods.escrowInfo(totalGoods).call({from:voters[k]})
            assert(r[0],accounts[3],"escrowInfo error")
            assert(r[1],accounts[0],"escrowInfo error")
            assert(r[2],accounts[6],"escrowInfo error")
            assert(r[3],0,"escrowInfo error")
            assert(r[4],0,"escrowInfo error")
            assert(r[5]+"","false","escrowInfo error")
            assert(r[6]+"","false","escrowInfo error")
        }

        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[3],gas:3000000})
        await instance.methods.voteForSeller(totalGoods).send({from:accounts[0],gas:3000000})
        await instance.methods.voteForBuyer(totalGoods).send({from:accounts[6],gas:3000000})

        for (let i=0;i<=5;i++) {
            r=await web3.eth.getBalance(accounts[i])
            r=web3.utils.fromWei(r,"ether")
            r=parseFloat(r)
            if(i==0) {
                assert(r,b[i],"balance error")
            } else {
                assert(b[i]-0.1<r && r<b[i],true,"balance error")
            }
        }

        for(let k=0;k<3;k++) {
            r=await instance.methods.escrowInfo(totalGoods).call({from:voters[k]})
            assert(r[0],accounts[3],"escrowInfo error")
            assert(r[1],accounts[0],"escrowInfo error")
            assert(r[2],accounts[6],"escrowInfo error")
            assert(r[3],2,"escrowInfo error")
            assert(r[4],1,"escrowInfo error")
            if(k<2) {
                assert(r[5]+"","true","escrowInfo error")
            } else {
                assert(r[5]+"","false","escrowInfo error")
            }
            assert(r[6]+"","true","escrowInfo error")
        }

        r=await instance.methods.getGoods(totalGoods).call()
        assert(r[0],totalGoods,"getGoods error")
        assert(r[1],"iPhone 8","getGoods error")
        assert(r[2],"Mobile Phone","getGoods error")
        assert(r[3],"image","getGoods error")
        assert(r[4],"intro","getGoods error")
        assert(r[5],1,"getGoods error")
        assert(r[6],1,"getGoods error")
        assert(r[7],web3.utils.toWei("1","ether"),"getGoods error")
        assert(r[8],now,"getGoods error")
        assert(r[9],now+60,"getGoods error")
    })

    it("finalizeAuction",async () => {
        let now=parseInt(new Date()/1000)
        await instance.methods.addGoods("iPhone 8","Mobile Phone","image","intro",0,web3.utils.toWei("1","ether"),now,now+60).send({from:accounts[0],gas:3000000})

        let b={}
        for (let i=0;i<=5;i++) {
            b[i]=await web3.eth.getBalance(accounts[i])
            b[i]=web3.utils.fromWei(b[i],"ether")
        }

        let totalGoods=await instance.methods.totalGoods().call()
        wait(61)
        await instance.methods.finalizeAuction(totalGoods).send({from:accounts[6],gas:3000000})
        let r=await instance.methods.getGoods(totalGoods).call()
        assert(r[0],totalGoods,"getGoods error")
        assert(r[1],"iPhone 8","getGoods error")
        assert(r[2],"Mobile Phone","getGoods error")
        assert(r[3],"image","getGoods error")
        assert(r[4],"intro","getGoods error")
        assert(r[5],2,"getGoods error")
        assert(r[6],0,"getGoods error")
        assert(r[7],web3.utils.toWei("1","ether"),"getGoods error")
        assert(r[8],now,"getGoods error")
        assert(r[9],now+60,"getGoods error")
    })
})
