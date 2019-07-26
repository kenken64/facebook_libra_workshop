import React, { Component } from "react";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { LIBRA_API_URL } from "./config";
import firebase from "./Firestore";
import styles from "./Account.css";
import axios from "axios";

class Account extends Component {
  constructor() {
    console.log("constructor...");
    super();
    const db = firebase.firestore();
    this.walletRef = db.collection("wallet");

    this.state = {
      libra_image: "https://bit.ly/2Gr7VSV",
      accData: "",
      list: [],
      idx: 0
    };
  }

  componentWillMount() {
    console.log("before render ..");
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

  render() {
    console.log("rendering ui ..");
    return (
      <div className={styles.root}>
        <GridList cellHeight={180} className={styles.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <ListSubheader component="div">Accounts</ListSubheader>
          </GridListTile>
          {this.state.list.map(acc => (
            <GridListTile key={acc.id}>
              <img
                style={{ height: "200px", width: "200px" }}
                src={this.state.libra_image}
                alt={acc.walletName}
              />
              <GridListTileBar
                title={acc.walletName}
                subtitle={<span>Balance : {acc.balance}</span>}
                actionIcon={
                  <IconButton
                    aria-label={`info about ${acc.address}`}
                    className={styles.icon}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

export default Account;
