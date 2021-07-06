import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { getWeb3NoAccount } from "utils/web3";
import {
  getCNTStakerAddress,
  getFarmAddress,
  getSouschefContract,
} from "utils/addressHelpers";
import { getBiconomyWeb3 } from "utils/biconomyweb3";
import { splitSignature } from "@ethersproject/bytes";

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
  name: "Farm",
  version: "1",
  verifyingContract: getFarmAddress(),
  chainId: 80001,
};

const domainDataBar = {
  name: "CNTStaker",
  version: "1",
  verifyingContract: getCNTStakerAddress(),
  chainId: 80001,
};

export const GaslessStakeWithPermit = async (
  masterChefContract,
  pid,
  amount,
  account,
  deadline,
  v,
  r,
  s,
  library
) => {
  const contract = masterChefContract;
  const functionSignature = await contract.methods
    .depositWithPermit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      deadline,
      v,
      r,
      s
    )
    .encodeABI();

  return executeMetaTransaction(
    masterChefContract,
    account,
    functionSignature,
    library
  );
};

export const GaslessStake = async (
  masterChefContract,
  pid,
  amount,
  account,
  library
) => {
  const contract = masterChefContract;
  const functionSignature = await contract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .encodeABI();
  await executeMetaTransaction(
    masterChefContract,
    account,
    functionSignature,
    library
  );
};

export const GaslessUnStake = async (
  masterChefContract,
  pid,
  amount,
  account,
  library
) => {
  const contract = masterChefContract;
  const functionSignature = await contract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .encodeABI();

  await executeMetaTransaction(
    masterChefContract,
    account,
    functionSignature,
    library
  );
};

export const GaslessHarvest = async (
  masterChefContract,
  pid,
  account,
  library
) => {
  const contract = masterChefContract;
  const functionSignature = await contract.methods
    .deposit(pid, "0")
    .encodeABI();

  await executeMetaTransaction(
    masterChefContract,
    account,
    functionSignature,
    library
  );
};

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .send({ from: account, gasPrice: 10000000000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
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
    .send({ from: account, gasPrice: 10000000000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const sousStakeGasless = async (
  sousChefContract,
  amount,
  decimals = 18,
  account,
  souspid,
  library
) => {
  const pooladdress = getSouschefContract(souspid);
  const functionSignature = await sousChefContract.methods
    .deposit(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
    )
    .encodeABI();

  await executeMetaTransactionPools(
    sousChefContract,
    account,
    functionSignature,
    pooladdress,
    library
  );
};

export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .deposit()
    .send({
      from: account,
      gasPrice: 10000000000,
      value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString()
    )
    .send({ from: account, gasPrice: 10000000000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const sousUnstakeGasless = async (
  sousChefContract,
  amount,
  decimals = 18,
  account,
  souspid,
  library
) => {
  const pooladdress = getSouschefContract(souspid);
  const functionSignature = await sousChefContract.methods
    .withdraw(
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString()
    )
    .encodeABI();

  await executeMetaTransactionPools(
    sousChefContract,
    account,
    functionSignature,
    pooladdress,
    library
  );
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
    .send({ from: account })
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
  return masterChefContract.methods
    .deposit(pid, "0")
    .send({ from: account, gasPrice: 10000000000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit("0")
    .send({ from: account, gasPrice: 10000000000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const soushHarvestGasless = async (
  sousChefContract,
  account,
  souspid,
  library
) => {
  const pooladdress = getSouschefContract(souspid);
  const functionSignature = await sousChefContract.methods
    .deposit("0")
    .encodeABI();

  await executeMetaTransactionPools(
    sousChefContract,
    account,
    functionSignature,
    pooladdress,
    library
  );
};

export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .deposit()
    .send({ from: account, gasPrice: 10000000000, value: new BigNumber(0) })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const enterGasless = async (contract, amount, account) => {
  const functionSignature = await contract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .encodeABI();

  await executeMetaTransactionBar(contract, account, functionSignature);
};

export const enter = async (contract, amount, account) => {
  return contract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const leaveGasless = async (contract, amount, account) => {
  const functionSignature = await contract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .encodeABI();

  await executeMetaTransactionBar(contract, account, functionSignature);
};

export const leave = async (contract, amount, account) => {
  return contract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

const executeMetaTransaction = async (
  masterChefContract,
  account,
  functionSignature,
  library
) => {
  const biconomyWeb3 = getBiconomyWeb3();
  const web3 = getWeb3NoAccount();
  const contract = masterChefContract;

  try {
    const nonce = await masterChefContract.methods.getNonce(account).call();

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

    const sig = await library.send("eth_signTypedData_v4", [
      account.toString(),
      dataToSign,
    ]);

    const signature = await splitSignature(sig.result);
    console.log(signature);
    const { v, r, s } = signature;

    console.log({ account, functionSignature, r, s, v });
    contract.methods
      .executeMetaTransaction(account, functionSignature, r, s, v)
      .send({
        from: account,
      })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } catch (e) {
    console.error("error");
  }
};

export const executeMetaTransactionBar = async (
  masterChefContract,
  account,
  functionSignature
) => {
  const biconomyWeb3 = getBiconomyWeb3();

  const contract = masterChefContract;

  const nonce = await contract.methods.getNonce(account).call();
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
    domain: domainDataBar,
    primaryType: "MetaTransaction",
    message,
  });

  try {
    // @ts-ignore
    await biconomyWeb3.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [account, dataToSign],
      },
      async (error, response) => {
        if (error) {
          console.error(error);
          return error;
        }
        const { r, s, v } = getSignatureParameters(response.result);
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
    console.error("error");
  }
};

export const executeMetaTransactionPools = async (
  masterChefContract,
  account,
  functionSignature,
  pooladdress,
  library
) => {
  const domainDataPool = {
    name: "StakingPool",
    version: "1",
    verifyingContract: pooladdress,
    chainId: 80001,
  };

  const biconomyWeb3 = getBiconomyWeb3();

  const contract = masterChefContract;
  try {
    const nonce = await contract.methods.getNonce(account).call();
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
      domain: domainDataPool,
      primaryType: "MetaTransaction",
      message,
    });

    const sig = await library.send("eth_signTypedData_v4", [
      account.toString(),
      dataToSign,
    ]);

    const signature = await splitSignature(sig.result);
    console.log(signature);
    const { v, r, s } = signature;

    // @ts-ignore

    contract.methods
      .executeMetaTransaction(account, functionSignature, r, s, v)
      .send({
        from: account,
      })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } catch (e) {
    console.error("error");
  }
};
