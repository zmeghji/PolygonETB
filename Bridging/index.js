require("dotenv").config();
const config = require('./config');

const { POSClient,use,setProofApi  } = require('@maticnetwork/maticjs');
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
    
    await hasEthBeenDeposited(posClient, txHash)

    return txHash;
}

async function hasEthBeenDeposited(posClient,txHash){
    const isDeposited = await posClient.isDeposited(txHash);
    console.log("isDeposited: ", isDeposited);
}

async function startWithdrawEth(posClient, amount ){
  const erc20Token = posClient.erc20(config.posChildWETH);
  const result = await erc20Token.withdrawStart(amount);
  const txHash = await result.getTransactionHash();
  console.log("startWithdrawEth txHash ",txHash);
  const txReceipt = await result.getReceipt();
  console.log("startWithdrawEth txReceipt ",txReceipt);
  return txHash;
}

async function finishWithdrawEth(posClient,txHash){
  const erc20Token = posClient.erc20(config.rootChainWETH, true);
  // const result = await erc20Token.withdrawExit(txHash);
  const result = await erc20Token.withdrawExitFaster(txHash);
  const txHash2 = await result.getTransactionHash();
  console.log("finishWithdrawEth txHash2 ",txHash2);
  const txReceipt2 = await result.getReceipt();
  console.log("finishWithdrawEth txReceipt2 ",txReceipt2);
}

async function depositErc20(posClient, amount){
  const erc20Token = posClient.erc20("0x655f2166b0709cd575202630952d71e2bb0d61af", true);
  const approveResult = await erc20Token.approve(amount);
  const approveTxHash = await approveResult.getTransactionHash();
  const approveTxReceipt = await approveResult.getReceipt();

  const balance = await erc20Token.getAllowance(config.user1);

  const result = await erc20Token.deposit(amount, config.user1);
  
  const txHash = await result.getTransactionHash();
  console.log("depositErc20 txHash ",txHash);
  const txReceipt = await result.getReceipt();
  console.log("depositErc20 txReceipt ",txReceipt);

  return txHash;
}
async function main(){
    use(Web3ClientPlugin)
  setProofApi("https://apis.matic.network/")

    let posClient = await createPOSClient();

    //Deposit Eth
    // let txHash = await moveEthToPolygon(posClient, 1000000000000000)
    // let txHash ="0xb7a84948b08ced20852e64ce6b6e0b5823a16a485fd6c316d1b8b6c24bb2954f";
    // await hasEthBeenDeposited(posClient, txHash);

    // start withdrawing eth 
    // let txHash = await startWithdrawEth(posClient, 500000000000000)

    //finish withdrawing eth
    // let txHash = '0x69d1fec9ec790e66cbba1f340ea6398f1da9568c2b4a7ef3ef916cefbc9f46a8';
    // await finishWithdrawEth(posClient, txHash)

    // deposit erc20 
    let txHash = await depositErc20(posClient, 1000000000000000)

}

main();