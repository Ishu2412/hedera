import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import {
  Client,
  PrivateKey,
  AccountId,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery, // Fix: Correct import name
  Hbar,
} from "@hashgraph/sdk";

//configure accounts and clients
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromStringECDSA(
  process.env.OPERATOR_PRIVATE_KEY
);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {
  // importing the compiled created bytecode
  const contractBytecode = fs.readFileSync("Data_sol_Data.bin");

  const fileCreateTx = new FileCreateTransaction()
    .setContents(contractBytecode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(0.75))
    .freezeWith(client);

  const fileCreateSign = await fileCreateTx.sign(operatorKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The bytecode file ID is: ${bytecodeFileId}`);

  const contractInstantiateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(10000000)
    .setConstructorParameters(
      new ContractFunctionParameters().addUint256(1).addUint256(111)
    );
  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(
    client
  );
  const contractId = contractInstantiateRx.contractId;
  const contractAddress = contractId.toSolidityAddress();
  console.log(`The smart contract id is: ${contractId}`);
  console.log(
    `The smart contract id in solidity format is : ${contractAddress}`
  );

  const contractQueryTx = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(10000000)
    .setFunction("retrieveDataSmart")
    .setMaxQueryPayment(new Hbar(100000));

  const contractQuerySubmit = await contractQueryTx.execute(client);
  const contractCallResult = await contractQuerySubmit.getUint256(1);
  console.log(`Result: ${contractCallResult}`);
  // if (contractCallResult != null) {
  //   console.log("Result:", contractCallResult.toStringUtf8()); // Assuming the result is a string
  // } else {
  //   console.log("Contract call result is null.");
  // }
}

main();
