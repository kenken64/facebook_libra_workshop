import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import firebase from "./Firestore";
import { LIBRA_API_URL } from "./config";

function GenerateWallet(props) {
  const [walletName, setWalletName] = useState("Default wallet");

  function saveWalletTofirebase() {
    console.log("generate new wallet store to firestore...");
    props.handleClose();
    const db = firebase.firestore();
    let bodyValue = {};
    fetch(`${LIBRA_API_URL}/account`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyValue)
    })
      .then(function(response) {
        console.log(response);
        return response.json();
      })
      .then(function(data) {
        console.log(data);
        db.collection("wallet").add({
          walletName: walletName,
          address: data.address,
          mnemonic: data.mnemonic
        });
        setWalletName("");
      })
      .catch(error => {
        console.log(error);
      });
  }

  function updateWalletName(event) {
    console.log(event.target.value);
    event.preventDefault();
    setWalletName(event.target.value);
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Generate Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure to generate Facebook Libra account?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Wallet name"
          onChange={updateWalletName}
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={saveWalletTofirebase} color="primary">
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GenerateWallet;
