require("dotenv").config();
const config = require('./config');

const { POSClient,use  } = require('@maticnetwork/maticjs');
const {Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');

async function createPOSClient(){
    const posClient = new POSClient();
    await posClient.init({
        network: 'testnet',
        version: 'mumbai',
        parent: {
          provider: new HDWalletProvider(process.env.PRIVATE_KEY, process.env.GOERLI_RPC_URL),
          defaultConfig: {
            from : config.user1
          }
        },
        child: {
          provider: new HDWalletProvider(process.env.PRIVATE_KEY, process.env.MUMBAI_RPC_URL),
          defaultConfig: {
            from : config.user1
          }
        }
    });
    return posClient;
}


async function moveEthToPolygon(posClient, amount){
    console.log("got here")
    const result = await posClient.depositEther(amount, config.user1);
    const txHash = await result.getTransactionHash();
    console.log("moveEthToPolygon txHash ",txHash);
    const txReceipt = await result.getReceipt();
    console.log("moveEthToPolygon txReceipt ", txReceipt);
    
    await hasEthBeenMoved(posClient, txHash)

    return txHash;
}

async function hasEthBeenMoved(posClient,txHash){
    const isDeposited = await posClient.isDeposited(txHash);
    console.log("isDeposited: ", isDeposited);
}


async function main(){
    use(Web3ClientPlugin)
    let posClient = await createPOSClient();

    // let txHash = await moveEthToPolygon(posClient, 1000000000000000)
    // let txHash ="0xb7a84948b08ced20852e64ce6b6e0b5823a16a485fd6c316d1b8b6c24bb2954f";
    // await hasEthBeenMoved(posClient, txHash);


}

main();