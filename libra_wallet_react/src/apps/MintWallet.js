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

function MintWallet(props) {
  const [walletAmount, setWalletAmount] = useState(0);

  function tryToMintWallet() {
    console.log("generate new wallet store to firestore...");
    props.handleClose();

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
        setWalletAmount(0);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function updateWalletAmount(event) {
    console.log(event.target.value);
    event.preventDefault();
    setWalletAmount(event.target.value);
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Mint Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          How much would you like to mint on this wallet?
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="amount"
          label="Wallet amount"
          onChange={updateWalletAmount}
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={tryToMintWallet} color="primary">
          Mint
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MintWallet;
