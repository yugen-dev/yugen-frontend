import BigNumber from "bignumber.js";
import { constants, ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import masterChefABI from "config/abi/masterchef.json";
import { getMasterChefAddress } from "utils/addressHelpers";
import { AbiItem } from "web3-utils";
import { getWeb3NoAccount } from "utils/web3";
// import useBiconomyWeb3 from "../hooks/useBiconomyWeb3";
import useBiconomyWeb3 from "hooks/useBiconomyWeb3";
import { useMasterchefGasless } from "../hooks/useContract";

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};
export const getSignatureParameters = (signature) => {
  if (!ethers.utils.isHexString(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }
  const r = signature.slice(0, 66);
  const s = "0x".concat(signature.slice(66, 130));
  const x = "0x".concat(signature.slice(130, 132));
  let v = ethers.BigNumber.from(x).toNumber();
  if (![27, 28].includes(v)) v += 27;
  return {
    r,
    s,
    v,
  };
};

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
  { name: "chainId", type: "uint256" },
];
const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" },
];

const domainData = {
  name: "MasterChef",
  version: "1",
  verifyingContract: getMasterChefAddress(),
  chainId: 80001,
};

export const stake = async (masterChefContract, pid, amount, account) => {
  console.log(masterChefContract._address);

  // const biconomy = new Biconomy((window as WindowChain).ethereum, {
  //   apiKey: "jTZ4rld-C.223a91ce-4426-4344-93d0-81a4a3f596fa",
  // });
  // const biconomyWeb3 = new Web3(biconomy);
  // const contract = new biconomyWeb3.eth.Contract(
  //   masterChefABI as unknown as AbiItem,
  //   masterChefContract._address
  // );
  const biconomyWeb3 = useBiconomyWeb3();
  const contract = useMasterchefGasless();
  const nonce = await contract.methods.getNonce(account).call();
  const functionSignature = await contract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .encodeABI();
  const message = {
    nonce: 0,
    from: "",
    functionSignature: "",
  };
  message.nonce = parseInt(nonce);
  message.from = account;
  message.functionSignature = functionSignature;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message,
  });
  try {
    const web3 = getWeb3NoAccount();
    // @ts-ignore
    await biconomyWeb3.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [account, dataToSign],
      },
      async function (error, response) {
        if (error) {
          console.log(error);
          return error;
        }
        const { r, s, v } = getSignatureParameters(response.result);
        console.log({ r, s, v });
        const gasLimit = await contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .estimateGas({ from: account });
        const gasPrice = await biconomyWeb3.eth.getGasPrice();
        return contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .send({
            from: account,
            gasPrice: biconomyWeb3.utils.toHex(gasPrice),
            gasLimit: biconomyWeb3.utils.toHex(gasLimit),
          })
          .on("transactionHash", (tx) => {
            return tx.transactionHash;
          });
      }
    );
  } catch (e) {
    console.log("error");
  }

  // return masterChefContract.methods
  //   .deposit(
  //     pid,
  //     new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
  //   )
  //   .send({ from: account, gas: 200000 })
  //   .on("transactionHash", (tx) => {
  //     return tx.transactionHash;
  //   });
};

export const sousStake = async (
  sousChefContract,
  amount,
  decimals = 18,
  account
) => {
  return sousChefContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
    )
    .send({ from: account, gas: 200000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      gas: 200000,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const unstake = async (masterChefContract, pid, amount, account) => {
  const biconomy = new Biconomy((window as WindowChain).ethereum, {
    apiKey: "jTZ4rld-C.223a91ce-4426-4344-93d0-81a4a3f596fa",
  });
  const biconomyWeb3 = new Web3(biconomy);
  const contract = new biconomyWeb3.eth.Contract(
    masterChefABI as unknown as AbiItem,
    masterChefContract._address
  );
  const nonce = await contract.methods.getNonce(account).call();
  const functionSignature = await contract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .encodeABI();
  const message = {
    nonce: 0,
    from: "",
    functionSignature: "",
  };
  message.nonce = parseInt(nonce);
  message.from = account;
  message.functionSignature = functionSignature;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message,
  });
  try {
    const web3 = getWeb3NoAccount();
    // @ts-ignore
    biconomyWeb3.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [account, dataToSign],
      },
      async function (error, response) {
        if (error) {
          console.log(error);
          return error;
        }
        const { r, s, v } = getSignatureParameters(response.result);
        console.log({ r, s, v });
        const gasLimit = await contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .estimateGas({ from: account });
        const gasPrice = await biconomyWeb3.eth.getGasPrice();
        return contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .send({
            from: account,
            gasPrice: biconomyWeb3.utils.toHex(gasPrice),
            gasLimit: biconomyWeb3.utils.toHex(gasLimit),
          })
          .on("transactionHash", (tx) => {
            return tx.transactionHash;
          });
      }
    );
  } catch (e) {
    console.log("error");
  }
  // return masterChefContract.methods
  //   .withdraw(
  //     pid,
  //     new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
  //   )
  //   .send({ from: account, gas: 200000 })
  //   .on("transactionHash", (tx) => {
  //     return tx.transactionHash;
  //   });
};

export const sousUnstake = async (
  sousChefContract,
  amount,
  decimals = 18,
  account
) => {
  // shit code: hard fix for old CTK and BLK
  if (
    sousChefContract.options.address ===
    "0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC"
  ) {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  }
  if (
    sousChefContract.options.address ===
    "0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831"
  ) {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  }

  return sousChefContract.methods
    .withdraw(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
    )
    .send({ from: account, gas: 200000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const sousEmegencyUnstake = async (
  sousChefContract,
  amount,
  account
) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (masterChefContract, pid, account) => {
  console.log(masterChefContract._address);

  const biconomy = new Biconomy((window as WindowChain).ethereum, {
    apiKey: "jTZ4rld-C.223a91ce-4426-4344-93d0-81a4a3f596fa",
  });
  const biconomyWeb3 = new Web3(biconomy);
  const contract = new biconomyWeb3.eth.Contract(
    masterChefABI as unknown as AbiItem,
    masterChefContract._address
  );
  const nonce = await contract.methods.getNonce(account).call();
  const functionSignature = await contract.methods
    .deposit(pid, "0")
    .encodeABI();
  const message = {
    nonce: 0,
    from: "",
    functionSignature: "",
  };
  message.nonce = parseInt(nonce);
  message.from = account;
  message.functionSignature = functionSignature;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      MetaTransaction: metaTransactionType,
    },
    domain: domainData,
    primaryType: "MetaTransaction",
    message,
  });
  try {
    const web3 = getWeb3NoAccount();
    // @ts-ignore
    biconomyWeb3.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [account, dataToSign],
      },
      async function (error, response) {
        if (error) {
          console.log(error);
          return error;
        }
        const { r, s, v } = getSignatureParameters(response.result);
        console.log({ r, s, v });
        const gasLimit = await contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .estimateGas({ from: account });
        const gasPrice = await biconomyWeb3.eth.getGasPrice();
        return contract.methods
          .executeMetaTransaction(account, functionSignature, r, s, v)
          .send({
            from: account,
            gasPrice: biconomyWeb3.utils.toHex(gasPrice),
            gasLimit: biconomyWeb3.utils.toHex(gasLimit),
          })
          .on("transactionHash", (tx) => {
            return tx.transactionHash;
          });
      }
    );
  } catch (e) {
    console.log("error");
  }
  // return masterChefContract.methods
  //   .deposit(pid, "0")
  //   .send({ from: account, gas: 200000 })
  //   .on("transactionHash", (tx) => {
  //     return tx.transactionHash;
  //   });
};

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit("0")
    .send({ from: account, gas: 200000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gas: 200000, value: new BigNumber(0) })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const enter = async (contract, amount, account) => {
  return contract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      console.log(tx);
      return tx.transactionHash;
    });
};

export const leave = async (contract, amount, account) => {
  return contract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      console.log(tx);
      return tx.transactionHash;
    });
};
