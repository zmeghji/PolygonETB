require("dotenv").config();
async function main() {
  const maticPOSClient = new require("@maticnetwork/maticjs").MaticPOSClient({
    maticProvider: "https://matic-mumbai.chainstacklabs.com", // replace if using mainnet
    parentProvider: process.env.GOERLI_RPC_URL, // replace if using mainnet
  });

  const proof = maticPOSClient.posRootChainManager.customPayload(
    "0x03529a9a31ea8af854e66b640dd0a943c4558a024a5f063a05ccdc63d0bff0e3", // replace with txn hash of sendMessageToRoot
    "0x8c5261668696ce22758910d05bab8f186d6eb247ceac2af2e82c7dc17669b036" // SEND_MESSAGE_EVENT_SIG, do not change
  );
  return proof;
}

main()
  .then((result) => {
    console.log(result);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
