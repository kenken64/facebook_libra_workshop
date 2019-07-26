import React, { Component } from "react";
import firebase from "./Firestore";
import classes from "./Mint.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import { LIBRA_API_URL } from "./config";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MintWallet from "./MintWallet";

class Mint extends Component {
  constructor() {
    super();
    console.log("Mint ....");
    const db = firebase.firestore();
    this.walletRef = db.collection("wallet");

    this.state = {
      accData: "",
      list: [],
      idx: 0,
      isMintOpen: false
    };
    this.handleMint = this.handleMint.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.walletRef.get().then(querySnapshot => {
      querySnapshot.forEach(async doc => {
        const { walletName, address } = doc.data();
        console.log("...id " + doc.id);
        let res = await axios.get(`${LIBRA_API_URL}/balance/${address}`);
        const account = res.data;
        console.log(account);
        console.log(this.state.idx);
        let accData = {
          id: doc.id,
          address: address,
          balance: account.balance,
          walletName: walletName
        };
        this.setState({ accData: accData });
        this.setState(state => {
          state.list.push(state.accData);
        });
        this.setState({ idx: this.state.idx++ });
      });
    });
  }

  handleMint() {
    console.log("handle minting ...");
    this.setState({ isMintOpen: true });
  }

  handleClose() {
    this.setState({ isMintOpen: false });
  }

  render() {
    console.log("Rendering...");
    return (
      <List className={classes.root}>
        {this.state.list.map(acc => (
          <ListItem key={acc.id}>
            <Grid
              container
              justify="flex-start"
              alignItems="flex-start"
              spacing={4}
            >
              <Grid item border={0} xs={2}>
                <ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
              </Grid>
              <Grid item border={0} xs={7}>
                <ListItemText
                  primary={acc.walletName}
                  secondary={acc.balance}
                />
              </Grid>
              <Grid item border={0} xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={this.handleMint}
                >
                  Mint
                </Button>
                <MintWallet
                  open={this.state.isMintOpen}
                  handleClose={this.handleClose}
                />
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    );
  }
}

export default Mint;
