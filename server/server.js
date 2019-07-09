import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { LibraWallet, LibraClient, Account as LibraAccount } from "libra-core";

const app = express();
const port = process.env.PORT || 3000;
app.enable("trust proxy");
app.enable("x-powered-by");

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

const API_URL = "/api";
const FALLBACK_ADDRESS =
  "435fc8fc85510cf38a5b0cd6595cbb8fbb10aa7bb3fe9ad9820913ba867f79d4";

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
  res.json(account.getAddress().toHex());
});

/**
 * mint account
 */
app.get(`${API_URL}/mint-account`, () => {
  res.json({});
});

app.get(`${API_URL}/balance`, () => {
  res.json({});
});

app.post(`${API_URL}/transactions`, () => {
  res.json({});
});

async function getTransactions(accountNumber, sequenceNumber, cb) {
  const client = new LibraClient({ network: LibraNetwork.Testnet });
  const transaction = await client.getAccountTransaction(
    accountNumber,
    sequenceNumber
  );
  cb(transaction);
}

app.get(`${API_URL}/transactions`, () => {
  const address = req.params.address || FALLBACK_ADDRESS;
  const sequenceNumber = req.params.sequenceNumber || 0;
  getTransactions(address, sequenceNumber, transaction => {
    console.log(transaction);
  });
  res.json({});
});

app.listen(port, () => {
  console.log(`Facebook Libra API listening at ${port}`);
});
