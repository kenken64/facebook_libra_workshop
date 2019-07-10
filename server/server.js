import "babel-polyfill";
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

const app = express();
const port = process.env.PORT || 3000;
app.enable("trust proxy");
app.enable("x-powered-by");

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

const API_URL = "/api";
const FALLBACK_ADDRESS =
  "e5f1d73411a3bfd729f5370593a43fafd019a8f1e22c13ff9efda1a4eb96d97e";
//72f450b5a860f57e693fc09cbe38f16770463137388c5aaa1a1f1e409e7f0ec5

const client = new LibraClient({ network: LibraNetwork.Testnet });

app.get("/rpc", (req, res) => {
  const { method, params, id } = req.body;
  res.send({ jsonrpc: "2.0", id, method, params });
});

// create account wallet
app.post(`${API_URL}/account`, (req, res) => {
  const jsonData = req.body;
  console.log(jsonData.mnemonic);
  const wallet = new LibraWallet({
    mnemonic: jsonData.mnemonic
  });
  let account = null;

  if (typeof jsonData.secretkey !== "undefined") {
    console.log(jsonData.secretkey);
    account = LibraAccount.fromSecretKey(jsonData.secretkey);
  } else {
    account = wallet.newAccount();
  }
  res.status(200).json(account.getAddress().toHex());
});

/**
 * mint account
 */
app.get(`${API_URL}/mint-account/:address`, (req, res) => {
  console.log(req.params.address);
  console.log(req.query.amount);
  const address = req.params.address || FALLBACK_ADDRESS;
  const amount = req.query.amount || 0;
  console.log("address > " + address);
  console.log("amount > " + amount);

  mintAccount(address, amount, result => {
    res.status(200).json({ confirmation: result });
  });
});

app.get(`${API_URL}/balance`, (req, res) => {
  console.log("get balance ...");
  const address = req.params.address || FALLBACK_ADDRESS;
  getAccountBalance(address, result => {
    console.log("balance> " + result);
    res.status(200).json({ balance: result });
  });
});

app.post(`${API_URL}/transactions`, (req, res) => {
  res.status(200).json({});
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

async function getTransactions(accountNumber, sequenceNumber, cb) {
  const transaction = await client.getAccountTransaction(
    accountNumber,
    sequenceNumber
  );
  cb(transaction);
}

app.get(`${API_URL}/transactions/:address/:sequenceNo`, (req, res) => {
  const address = req.params.address || FALLBACK_ADDRESS;
  const sequenceNumber = req.params.sequenceNo || 0;
  getTransactions(address, sequenceNumber, transaction => {
    console.log(transaction);
    res.status(200).json(transaction);
  });
});

app.listen(port, () => {
  console.log(`Facebook Libra API listening at ${port}`);
});
