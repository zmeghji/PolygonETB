require("dotenv").config();
const config = require('./config');
const { POSClient,use  } = require('@maticnetwork/maticjs');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const {Web3ClientPlugin } = require("@maticnetwork/maticjs-web3");
const bn = require('bn.js')


const SCALING_FACTOR = new bn(10).pow(new bn(18))


// install web3 plugin
use(Web3ClientPlugin)

async function createPOSClient(){
    const posClient = new POSClient();
    await posClient.init({
        network: 'testnet',
        version: 'mumbai',
        parent: {
          provider: new HDWalletProvider(process.env.PRIVATE_KEY, process.env.GOERLI_RPC_URL),
          defaultConfig: {
            from : config.user1.address
          }
        },
        child: {
          provider: new HDWalletProvider(process.env.PRIVATE_KEY, process.env.MUMBAI_RPC_URL),
          defaultConfig: {
            from : config.user1.address
          }
        }
    });
    return posClient;
}

async function getErc20Balance(posClient, address){
    const erc20ChildToken = posClient.erc20(config.pos.child.erc20);
    const balanceInWei = await erc20ChildToken.getBalance(address);
    const balance = new bn(balanceInWei).div(SCALING_FACTOR);
    console.log ("balances for address ", address);
    console.log('balance in wei ', balanceInWei);
}
async function getErc721Balance(posClient,  address){
    const childERC20Token = posClient.erc721(config.pos.child.erc721);
    const result = await childERC20Token.getTokensCount(address);
    console.log ("balances for address ", address);
    console.log('erc 721 count: ', result);
}

async function transferErc20(posClient, amount,  to){
    const erc20ChildToken = posClient.erc20(config.pos.child.erc20);
    const result = await erc20ChildToken.transfer(amount, to);
    try{
    const txHash = await result.getTransactionHash();
    }
    catch(e){
        console.log(e);
    }
    const txReceipt = await result.getReceipt();
}


async function main(){
    let posClient = await createPOSClient();
    await getErc20Balance(posClient,config.user1.address);
    await getErc20Balance(posClient,config.user2.address);
    await getErc721Balance(posClient,config.user1.address);
    await transferErc20(posClient, 100000000000000, config.user2.address);
    await getErc20Balance(posClient,config.user1.address);
    await getErc20Balance(posClient,config.user2.address);
}
main();
