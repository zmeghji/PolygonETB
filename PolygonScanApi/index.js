require("dotenv").config();
const axios = require("axios").default;
const BN = require("bignumber.js");


async function getMaticBalance(address){
    let response = await axios({
        method: "get",
        url: `https://api.polygonscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.POLYGONSCAN_API_KEY}`,
        responseType: "json",
      })
    if (response.data.message == "OK") {
        const balanceInMATIC = new BN(response.data.result).div(new BN(10).pow(new BN(18)));
        console.log(`The balance of ${address} is ${balanceInMATIC} MATIC`);
    }
}

async function getGasPrice(){
    let response = axios({
        method: "get",
        url: 'https://gasstation-mainnet.matic.network',
        responseType: "json",
      })
    if (response.status == 200) {
        console.log("The recommended gas price is : \n", response.data );
    };
}

async function getContractAbi(address){
    let response = await axios({
        method: "get",
        url: `https://api.polygonscan.com/api?module=contract&action=getabi&address=${address}&apikey=${process.env.POLYGONSCAN_API_KEY}`,
        responseType: "json",
      });
    
    if (response.data.message == "OK") {
        console.log(`The ABI of the contract at ${address} is ${response.data.result}`,);
    }
}

async function main(){
    console.log("starting main()")

    console.log("");
    console.log("getting matic balance");
    await getMaticBalance("0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245")
    
    console.log("");
    console.log("getting gas price");
    await getGasPrice();

    console.log("");
    console.log("getting contract ABI");
    await getContractAbi("0x841ce48f9446c8e281d3f1444cb859b4a6d0738c");
}

main();

