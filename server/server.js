import "babel-polyfill";
// load .env config file where it picks up all the ENV varables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  LibraNetwork,
  LibraWallet,
  LibraClient,
  Account as LibraAccount
} from "libra-core";

const bip39 = require("bip39");

const app = express();
const port = process.env.PORT || 3000;
app.enable("trust proxy");
app.enable("x-powered-by");

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

const API_URL = "/api";
const FALLBACK_ADDRESS =
  process.env.FALLBACL_ACCOUNT ||
  "e5f1d73411a3bfd729f5370593a43fafd019a8f1e22c13ff9efda1a4eb96d97e";

const client = new LibraClient({ network: LibraNetwork.Testnet });

app.get("/rpc", (req, res) => {
  const { method, params, id } = req.body;
  res.send({ jsonrpc: "2.0", id, method, params });
});

/**
 * Create libra wallet acoount,
 * mnemonic seed is a list of words which store all the information needed to recover a  bitcoin wallet. Is generated from bip39 bitcoin package
 * User is require to keep their mnemonic phrases safe
 * */
app.post(`${API_URL}/account`, (req, res) => {
  console.log("Create new Libra account");
  createAccount(res);
});

async function createAccount(res) {
  const generatedMnemonic = bip39.generateMnemonic();
  console.log(generatedMnemonic);
  const wallet = new LibraWallet({
    mnemonic: generatedMnemonic
  });

  console.log("new account");
  const account = wallet.newAccount();

  let accountCreated = {
    address: account.getAddress().toHex(),
    mnemonic: generatedMnemonic
  };
  res.status(200).json(accountCreated);
}

/**
 * Mint account, this function is similar to those blockchain mining program
 * Create a libra out of the blockchain network and commit to the current libra reserve
 */
app.get(`${API_URL}/mint-account/:address`, (req, res) => {
  console.log("Minting Libra ... from blockchain network");
  console.log(req.params.address);
  console.log(req.query.amount);
  const address = req.params.address || FALLBACK_ADDRESS;
  const amount = req.query.amount || 0;
  console.log("address > " + address);
  console.log("amount > " + amount);

  mintAccount(address, amount, result => {
    res.status(200).json({ confirmation: result });
  }).catch(error => {
    console.log(error);
  });
});

/**
 * Check libra balance
 */
app.get(`${API_URL}/balance/:address`, (req, res) => {
  console.log("Check Libra balance ...");
  const address = req.params.address || FALLBACK_ADDRESS;
  getAccountBalance(address, result => {
    console.log("balance> " + result);
    res.status(200).json({
      address: address,
      balance: result
    });
  });
});

async function transferLibra(account, toAccountAddress, amount, cb) {
  const response = await client.transferCoins(
    account,
    toAccountAddress,
    amount
  );

  // wait for transaction confirmation
  await response.awaitConfirmation(client);
  cb(response);
}

/**
 * transfer the libra coin from one party to another
 */
app.post(`${API_URL}/transactions`, (req, res) => {
  console.log("Performing Libra transfer");
  const jsonData = req.body;
  const wallet = new LibraWallet({
    mnemonic: jsonData.from_wallet_mnemonic
  });

  const wallet2 = new LibraWallet({
    mnemonic: jsonData.to_wallet_mnemonic
  });
  const account = wallet.newAccount();
  const account2 = wallet2.newAccount();
  const account2Address = account2.getAddress().toHex();
  const amount = jsonData.amount;
  console.log(account.getAddress().toHex());
  console.log(account2Address);
  console.log(amount);
  transferLibra(account, account2Address, Number(amount), result => {
    console.log(result);
    res.status(200).json(result);
  });
});

async function getAccountBalance(accountAddress, cb) {
  const accountState = await client.getAccountState(accountAddress);
  cb(accountState.balance.toString());
}

async function mintAccount(address, amount, cb) {
  console.log(address, amount);
  const confirmationRefNo = await client.mintWithFaucetService(address, amount);
  cb(confirmationRefNo);
}

async function getTransactions(address, sequenceNumber, cb) {
  console.log("seq number " + typeof sequenceNumber);
  const accountState = await client.getAccountState(address);
  console.log(accountState);
  const transaction = await client.getAccountTransaction(
    address,
    sequenceNumber
  );
  cb(transaction);
}

/**
 * Retrieve transaction history of the transfered libra
 */
app.get(`${API_URL}/transactions/:address/:sequenceNo`, (req, res) => {
  console.log("Query transactions with seqNo");
  const address = req.params.address || FALLBACK_ADDRESS;
  console.log(address);
  const sequenceNumber = req.params.sequenceNo || 0;
  try {
    getTransactions(address, parseInt(sequenceNumber), transaction => {
      console.log(transaction);
      res.status(200).json(transaction);
    });
  } catch (error) {
    console.log("ERROR !!" + error);
    res.status(500).json(error);
  }
});

app.listen(port, () => {
  console.log(`Facebook Libra API listening at ${port}`);
});
